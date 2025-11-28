import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { KNOWN_USERS } from '../data/users';
import Button from './Button';
import './ShoppingListDetail.css';

function ShoppingListDetail({ user, token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unresolved'

  // Sledování změn pro optimistickou aktualizaci
  const [changedItems, setChangedItems] = useState(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Načíst detail seznamu z API
  useEffect(() => {
    if (token && id) {
      loadListDetail();
    }
  }, [token, id]);

  // Varování při opuštění stránky s neuloženými změnami
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Automatické uložení při unmount
  useEffect(() => {
    return () => {
      // Poznámka: Toto se spustí pouze při unmount komponenty
      // Nemůžeme zde spolehlivě použít async funkci, protože komponenta už bude unmounted
      // Uživatel by měl manuálně kliknout na "Uložit změny"
    };
  }, []); // Prázdné dependencies = cleanup se spustí POUZE při unmount

  const loadListDetail = async () => {
    if (!token || !id) return;

    setLoading(true);
    try {
      // Načíst detail seznamu
      const result = await api.getShoppingList(token, id);
      const listData = result.shoppingList || result;

      // Načíst položky samostatně
      const itemsResult = await api.getItems(token, id);
      const items = itemsResult.items || [];

      // Spojit data
      setList({
        ...listData,
        items: items
      });

      // Vyčistit změny po načtení nových dat
      setChangedItems(new Set());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Chyba při načítání seznamu:', error);
      alert('Nepodařilo se načíst seznam');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-container">
        <p>Načítání...</p>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="detail-container">
        <p>Seznam nenalezen</p>
        <Link to="/">Zpět na přehled</Link>
      </div>
    );
  }

  // Backend používá ownerId místo owner
  const owner = list.ownerId || list.owner;
  const isOwner = owner?._id === user?._id;
  // Vlastník je vždy člen, i když není v members array
  const isMember = isOwner || list.members?.some(m => m._id === user?._id);

  // Úprava názvu seznamu
  const handleStartEditName = () => {
    setEditedName(list.name);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || !token) return;

    try {
      await api.updateShoppingList(token, id, editedName);
      setIsEditingName(false);
      await loadListDetail();
    } catch (error) {
      console.error('Chyba při úpravě názvu:', error);
      alert('Nepodařilo se upravit název');
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  // Přidání položky
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !token) return;

    try {
      await api.addItem(token, id, newItemName, 1);
      setNewItemName('');
      await loadListDetail();
    } catch (error) {
      console.error('Chyba při přidávání položky:', error);
      alert('Nepodařilo se přidat položku');
    }
  };

  // Změna množství položky (pouze lokálně)
  const handleQuantityChange = (itemId, change) => {
    setList(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item._id === itemId) {
          const newQuantity = Math.max(1, (item.quantity || 1) + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    }));

    // Označit jako změněnou
    setChangedItems(prev => new Set(prev).add(itemId));
    setHasUnsavedChanges(true);
  };

  // Odebrání položky
  const handleRemoveItem = async (itemId) => {
    if (!token) return;

    try {
      await api.deleteItem(token, id, itemId);
      await loadListDetail();
    } catch (error) {
      console.error('Chyba při odebírání položky:', error);
      alert('Nepodařilo se odebrat položku');
    }
  };

  // Označení položky jako vyřešené/nevyřešené (pouze lokálně)
  const handleToggleItem = (itemId) => {
    setList(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item._id === itemId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    }));

    // Označit jako změněnou
    setChangedItems(prev => new Set(prev).add(itemId));
    setHasUnsavedChanges(true);
  };

  // Uložit všechny změny najednou
  const handleSaveChanges = async () => {
    if (!token || !hasUnsavedChanges) return;

    setSaving(true);
    try {
      // Projít všechny změněné položky a uložit je
      for (const itemId of changedItems) {
        const item = list.items.find(i => i._id === itemId);
        if (!item) continue;

        // Aktualizovat položku (quantity a name)
        await api.updateItem(token, id, itemId, item.name, item.quantity);

        // Aktualizovat completed status
        const originalItem = list.items.find(i => i._id === itemId);
        if (item.completed) {
          await api.checkItem(token, id, itemId);
        } else {
          await api.uncheckItem(token, id, itemId);
        }
      }

      // Vyčistit změny
      setChangedItems(new Set());
      setHasUnsavedChanges(false);

      // Znovu načíst data pro potvrzení
      await loadListDetail();
    } catch (error) {
      console.error('Chyba při ukládání změn:', error);
      alert('Nepodařilo se uložit některé změny');
    } finally {
      setSaving(false);
    }
  };

  // Přidání člena
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberId || !token) return;

    try {
      await api.inviteUser(token, id, newMemberId);
      setNewMemberId('');
      await loadListDetail();
    } catch (error) {
      console.error('Chyba při přidávání člena:', error);
      alert('Nepodařilo se přidat člena');
    }
  };

  // Odebrání člena (pouze vlastník)
  const handleRemoveMember = async (memberId) => {
    const owner = list.ownerId || list.owner;
    if (memberId === owner?._id) {
      alert('Nelze odebrat vlastníka seznamu');
      return;
    }

    if (!token) return;

    try {
      await api.removeUser(token, id, memberId);
      await loadListDetail();
    } catch (error) {
      console.error('Chyba při odebírání člena:', error);
      alert('Nepodařilo se odebrat člena');
    }
  };

  // Odejít ze seznamu (člen, který není vlastník)
  const handleLeaveList = async () => {
    if (!window.confirm('Opravdu chcete opustit tento seznam?')) return;
    if (!token || !user) return;

    try {
      await api.removeUser(token, id, user._id);
      navigate('/');
    } catch (error) {
      console.error('Chyba při opouštění seznamu:', error);
      alert('Nepodařilo se opustit seznam');
    }
  };

  // Filtrování položek
  const filteredItems = filter === 'unresolved'
    ? list.items.filter(item => !item.completed)
    : list.items;

  // Dostupní uživatelé pro přidání (kteří ještě nejsou členy)
  const membersIds = list.members?.map(m => m._id) || [];
  const availableUsers = KNOWN_USERS.filter(u => !membersIds.includes(u._id));

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Link to="/" className="back-link">← Zpět na přehled</Link>

        <div className="title-section">
          {isEditingName ? (
            <div className="title-edit">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="title-input"
                autoFocus
              />
              <Button text="Uložit" color="success" action={handleSaveName} />
              <Button text="Zrušit" color="cancel" action={handleCancelEditName} />
            </div>
          ) : (
            <div className="title-display">
              <h2>{list.name}</h2>
              {isOwner && (
                <Button text="Upravit název" color="edit" action={handleStartEditName} />
              )}
            </div>
          )}
        </div>

        <div className="owner-info">
          <span className="owner-label">
            Vlastník: <strong>{owner?.name || 'Neznámý'}</strong>
          </span>
          {!isOwner && isMember && (
            <Button text="Opustit seznam" color="danger" action={handleLeaveList} />
          )}
        </div>
      </div>

      <div className="detail-content">
        {/* Členové */}
        <section className="members-section">
          <h3>Členové ({list.members?.length || 0})</h3>
          <div className="members-list">
            {list.members?.map(member => (
              <div key={member._id} className="member-item">
                <span>
                  {member.name}
                  {member._id === owner?._id && ' (vlastník)'}
                </span>
                {isOwner && member._id !== owner?._id && (
                  <Button
                    text="Odebrat"
                    color="danger"
                    size="small"
                    action={() => handleRemoveMember(member._id)}
                  />
                )}
              </div>
            ))}
          </div>

          {isOwner && availableUsers.length > 0 && (
            <form onSubmit={handleAddMember} className="add-member-form">
              <select
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="select-input"
              >
                <option value="">Vyberte uživatele k přidání...</option>
                {availableUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <Button text="Přidat člena" color="primary" type="submit" />
            </form>
          )}
          {isOwner && availableUsers.length === 0 && (
            <p className="empty-message">Všichni dostupní uživatelé jsou již členy.</p>
          )}
        </section>

        {/* Položky */}
        <section className="items-section">
          <div className="items-header">
            <div className="items-title">
              <h3>Položky</h3>
              <span className="items-count">
                Vyřešeno: {list.items?.filter(item => item.completed).length || 0} / {list.items?.length || 0}
              </span>
              {hasUnsavedChanges && (
                <span style={{ marginLeft: '10px', color: '#ff6b6b', fontSize: '14px' }}>
                  • Neuložené změny
                </span>
              )}
            </div>
            <div className="filter-buttons">
              {hasUnsavedChanges && (
                <Button
                  text={saving ? "Ukládám..." : "Uložit změny"}
                  color="success"
                  action={handleSaveChanges}
                  disabled={saving}
                />
              )}
              <Button
                text="Všechny"
                color="filter"
                action={() => setFilter('all')}
                active={filter === 'all'}
              />
              <Button
                text="Nevyřešené"
                color="filter"
                action={() => setFilter('unresolved')}
                active={filter === 'unresolved'}
              />
            </div>
          </div>

          {isMember && (
            <form onSubmit={handleAddItem} className="add-item-form">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Přidat novou položku..."
                className="text-input"
              />
              <Button text="Přidat" color="primary" type="submit" />
            </form>
          )}

          <div className="items-list">
            {filteredItems.length === 0 ? (
              <p className="empty-message">
                {filter === 'unresolved'
                  ? 'Všechny položky jsou vyřešené!'
                  : 'Zatím zde nejsou žádné položky.'}
              </p>
            ) : (
              filteredItems.map(item => (
                <div key={item._id} className={`item ${item.completed ? 'resolved' : ''}`}>
                  <label className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleItem(item._id)}
                      disabled={!isMember}
                    />
                    <span className="item-name">
                      {item.name}
                      {item.quantity > 1 && <span className="item-quantity"> {item.quantity}x</span>}
                    </span>
                  </label>
                  <div className="item-actions">
                    {isMember && (
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                          title="Snížit množství"
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="quantity-btn"
                          title="Zvýšit množství"
                        >
                          +
                        </button>
                      </div>
                    )}
                    {isMember && (
                      <Button
                        text="Odebrat"
                        color="danger"
                        size="small"
                        action={() => handleRemoveItem(item._id)}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ShoppingListDetail;
