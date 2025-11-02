import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { USERS } from '../data/initialData';
import Button from './Button';
import './ShoppingListDetail.css';

function ShoppingListDetail({ lists, setLists, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const list = lists.find(l => l.id === id);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unresolved'

  if (!list) {
    return (
      <div className="detail-container">
        <p>Seznam nenalezen</p>
        <Link to="/">Zpět na přehled</Link>
      </div>
    );
  }

  const isOwner = list.owner === currentUser;
  const isMember = list.members.includes(currentUser);

  // Úprava názvu seznamu
  const handleStartEditName = () => {
    setEditedName(list.name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      setLists(lists.map(l =>
        l.id === id ? { ...l, name: editedName } : l
      ));
    }
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  // Přidání položky
  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemName.trim()) {
      const newItem = {
        id: Date.now().toString(),
        name: newItemName,
        quantity: 1,
        resolved: false
      };
      setLists(lists.map(l =>
        l.id === id ? { ...l, items: [...l.items, newItem] } : l
      ));
      setNewItemName('');
    }
  };

  // Změna množství položky
  const handleQuantityChange = (itemId, change) => {
    setLists(lists.map(l =>
      l.id === id ? {
        ...l,
        items: l.items.map(item =>
          item.id === itemId ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) } : item
        )
      } : l
    ));
  };

  // Odebrání položky
  const handleRemoveItem = (itemId) => {
    setLists(lists.map(l =>
      l.id === id ? { ...l, items: l.items.filter(item => item.id !== itemId) } : l
    ));
  };

  // Označení položky jako vyřešené/nevyřešené
  const handleToggleItem = (itemId) => {
    setLists(lists.map(l =>
      l.id === id ? {
        ...l,
        items: l.items.map(item =>
          item.id === itemId ? { ...item, resolved: !item.resolved } : item
        )
      } : l
    ));
  };

  // Přidání člena
  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMemberId && !list.members.includes(newMemberId) && USERS[newMemberId]) {
      setLists(lists.map(l =>
        l.id === id ? { ...l, members: [...l.members, newMemberId] } : l
      ));
      setNewMemberId('');
    }
  };

  // Odebrání člena (pouze vlastník)
  const handleRemoveMember = (memberId) => {
    if (memberId === list.owner) {
      alert('Nelze odebrat vlastníka seznamu');
      return;
    }
    setLists(lists.map(l =>
      l.id === id ? { ...l, members: l.members.filter(m => m !== memberId) } : l
    ));
  };

  // Odejít ze seznamu (člen, který není vlastník)
  const handleLeaveList = () => {
    if (window.confirm('Opravdu chcete opustit tento seznam?')) {
      setLists(lists.map(l =>
        l.id === id ? { ...l, members: l.members.filter(m => m !== currentUser) } : l
      ));
      navigate('/');
    }
  };

  // Filtrování položek
  const filteredItems = filter === 'unresolved'
    ? list.items.filter(item => !item.resolved)
    : list.items;

  const availableUsers = Object.values(USERS).filter(
    user => !list.members.includes(user.id)
  );

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
            Vlastník: <strong>{USERS[list.owner].name}</strong>
          </span>
          {!isOwner && isMember && (
            <Button text="Opustit seznam" color="danger" action={handleLeaveList} />
          )}
        </div>
      </div>

      <div className="detail-content">
        {/* Členové */}
        <section className="members-section">
          <h3>Členové ({list.members.length})</h3>
          <div className="members-list">
            {list.members.map(memberId => (
              <div key={memberId} className="member-item">
                <span>
                  {USERS[memberId].name}
                  {memberId === list.owner && ' (vlastník)'}
                </span>
                {isOwner && memberId !== list.owner && (
                  <Button
                    text="Odebrat"
                    color="danger"
                    size="small"
                    action={() => handleRemoveMember(memberId)}
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
                <option value="">Vyberte člena k přidání...</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <Button text="Přidat člena" color="primary" type="submit" />
            </form>
          )}
        </section>

        {/* Položky */}
        <section className="items-section">
          <div className="items-header">
            <div className="items-title">
              <h3>Položky</h3>
              <span className="items-count">
                Vyřešeno: {list.items.filter(item => item.resolved).length} / {list.items.length}
              </span>
            </div>
            <div className="filter-buttons">
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
                <div key={item.id} className={`item ${item.resolved ? 'resolved' : ''}`}>
                  <label className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={item.resolved}
                      onChange={() => handleToggleItem(item.id)}
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
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                          title="Snížit množství"
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
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
                        action={() => handleRemoveItem(item.id)}
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