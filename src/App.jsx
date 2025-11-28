import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ShoppingListOverview from './components/ShoppingListOverview';
import ShoppingListDetail from './components/ShoppingListDetail';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import './App.css';

function App() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Načíst shopping listy z API při přihlášení
  useEffect(() => {
    if (token) {
      loadShoppingLists();
    }
  }, [token]);

  const loadShoppingLists = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const result = await api.getAllShoppingLists(token);
      // API vrací { count, shoppingLists }
      setShoppingLists(result.shoppingLists || []);
    } catch (error) {
      console.error('Chyba při načítání seznamů:', error);
      setShoppingLists([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>Nákupní seznamy</h1>
          <nav className="app-nav">
            <Link to="/">Nákupní seznamy</Link>
            <Link to="/dashboard">Uživatelé</Link>
          </nav>
          <div className="user-info">
            {isAuthenticated ? (
              <>
                Přihlášen jako: <strong>{user?.name || 'Neznámý uživatel'}</strong>
                <button onClick={logout} className="logout-btn" style={{ marginLeft: '10px' }}>
                  Odhlásit
                </button>
              </>
            ) : (
              <span>Nepřihlášen - <Link to="/dashboard">Přihlásit se</Link></span>
            )}
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <ShoppingListOverview
                lists={shoppingLists}
                setLists={setShoppingLists}
                user={user}
                token={token}
                onListsChange={loadShoppingLists}
              />
            }
          />
          <Route
            path="/list/:id"
            element={
              <ShoppingListDetail
                user={user}
                token={token}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;