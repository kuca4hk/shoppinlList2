import { useState } from 'react';
import { Link } from 'react-router-dom';
import { USERS } from '../data/initialData';
import Button from './Button';
import Modal from './Modal';
import './ShoppingListOverview.css';

function ShoppingListOverview({ lists, setLists, currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [listToDelete, setListToDelete] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  // Přidání nového seznamu
  const handleAddList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList = {
        id: Date.now().toString(),
        name: newListName,
        owner: currentUser,
        members: [currentUser],
        archived: false,
        items: []
      };
      setLists([...lists, newList]);
      setNewListName('');
      setIsModalOpen(false);
    }
  };

  // Otevřít potvrzovací modal pro smazání
  const handleDeleteClick = (listId, listName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setListToDelete({ id: listId, name: listName });
    setIsDeleteModalOpen(true);
  };

  // Potvrdit smazání seznamu
  const confirmDelete = () => {
    if (listToDelete) {
      setLists(lists.filter(list => list.id !== listToDelete.id));
      setIsDeleteModalOpen(false);
      setListToDelete(null);
    }
  };

  // Zrušit smazání
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setListToDelete(null);
  };

  // Přepnout archivaci (pouze vlastník)
  const toggleArchive = (listId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLists(lists.map(list =>
      list.id === listId ? { ...list, archived: !list.archived } : list
    ));
  };

  // Filtrování seznamů
  const filteredLists = showArchived
    ? lists
    : lists.filter(list => !list.archived);

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h2>Moje nákupní seznamy</h2>
        <Button
          text="+ Přidat seznam"
          color="primary"
          action={() => setIsModalOpen(true)}
          size="large"
        />
      </div>

      <div className="filter-section">
        <div className="filter-buttons">
          <Button
            text="Ne-archivované"
            color="filter"
            action={() => setShowArchived(false)}
            active={!showArchived}
          />
          <Button
            text="Včetně archivovaných"
            color="filter"
            action={() => setShowArchived(true)}
            active={showArchived}
          />
        </div>
      </div>

      {filteredLists.length === 0 ? (
        <div className="empty-state">
          <p>Zatím nemáte žádné {showArchived ? '' : 'ne-archivované '}nákupní seznamy.</p>
          <p>Vytvořte si svůj první seznam pomocí tlačítka výše.</p>
        </div>
      ) : (
        <div className="lists-grid">
          {filteredLists.map(list => {
            const isOwner = list.owner === currentUser;
            const isMember = list.members.includes(currentUser);

            return (
              <div key={list.id} className="list-card-wrapper">
                <Link to={`/list/${list.id}`} className={`list-card ${list.archived ? 'archived' : ''}`}>
                  <div className="list-card-header">
                    <h3>{list.name}</h3>
                    <div className="card-actions">
                      {isOwner && (
                        <>
                          <button
                            className="archive-btn"
                            onClick={(e) => toggleArchive(list.id, e)}
                            title={list.archived ? "Obnovit ze archivu" : "Archivovat"}
                            aria-label={list.archived ? "Obnovit ze archivu" : "Archivovat"}
                          >
                            {list.archived ? '📂' : '📁'}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={(e) => handleDeleteClick(list.id, list.name, e)}
                            title="Smazat seznam"
                            aria-label="Smazat seznam"
                          >
                            ×
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="list-owner">
                    {USERS[list.owner].name}
                  </div>
                  {list.archived && (
                    <div className="archived-badge">
                      Archivováno
                    </div>
                  )}
                  {!isMember && (
                    <div className="not-member-badge">
                      Nejste členem
                    </div>
                  )}
                  <div className="list-stats-wrapper">
                    <div className="list-stats">
                      <span>{list.items.length}</span>
                      <span>{list.items.filter(item => item.resolved).length}</span>
                      <span>{list.members.length}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewListName('');
        }}
        title="Vytvořit nový seznam"
      >
        <form onSubmit={handleAddList} className="add-list-form">
          <div className="form-group">
            <label htmlFor="list-name">Název seznamu</label>
            <input
              id="list-name"
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Např. Týdenní nákup..."
              className="text-input"
              autoFocus
              required
            />
          </div>
          <div className="form-actions">
            <Button
              text="Zrušit"
              color="cancel"
              action={() => {
                setIsModalOpen(false);
                setNewListName('');
              }}
            />
            <Button
              text="Vytvořit seznam"
              color="success"
              type="submit"
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="Smazat seznam"
      >
        <div className="delete-confirmation">
          <div className="delete-warning-icon">⚠️</div>
          <p className="delete-message">
            Opravdu chcete smazat seznam <strong>"{listToDelete?.name}"</strong>?
          </p>
          <p className="delete-warning">
            Tato akce je nevratná a smažete všechny položky v tomto seznamu.
          </p>
          <div className="form-actions">
            <Button
              text="Zrušit"
              color="cancel"
              action={cancelDelete}
            />
            <Button
              text="Ano, smazat"
              color="danger"
              action={confirmDelete}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ShoppingListOverview;