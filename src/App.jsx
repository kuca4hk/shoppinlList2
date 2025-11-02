import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ShoppingListOverview from './components/ShoppingListOverview';
import ShoppingListDetail from './components/ShoppingListDetail';
import { INITIAL_SHOPPING_LISTS, CURRENT_USER, USERS } from './data/initialData';
import './App.css';

function App() {
  const [shoppingLists, setShoppingLists] = useState(INITIAL_SHOPPING_LISTS);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>Nákupní seznamy</h1>
          <div className="user-info">
            Přihlášen jako: <strong>{USERS[CURRENT_USER].name}</strong>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={<ShoppingListOverview lists={shoppingLists} />}
          />
          <Route
            path="/list/:id"
            element={
              <ShoppingListDetail
                lists={shoppingLists}
                setLists={setShoppingLists}
                currentUser={CURRENT_USER}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;