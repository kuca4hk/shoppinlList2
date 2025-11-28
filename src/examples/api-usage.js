// Příklady použití API clienta
// Tento soubor obsahuje ukázky, jak používat API client pro komunikaci s backendem

import { api } from '../api/client';

// ===== PŘIHLÁŠENÍ =====

// Přihlášení uživatele
async function loginExample() {
  try {
    const response = await api.login('john@example.com', 'password123');
    console.log('Přihlášení úspěšné:', response);
    // response obsahuje: { status, message, data: { token, user } }

    const token = response.data.token;
    // Uložit token pro další použití (např. do localStorage)
    localStorage.setItem('token', token);

    return token;
  } catch (error) {
    console.error('Chyba při přihlášení:', error);
    // error obsahuje: { name, message, status, data }
    // error.status - HTTP status kód (400, 401, 500, atd.)
    // error.message - chybová zpráva
    // error.data - dodatečná data (např. pole validačních chyb)
  }
}

// ===== SHOPPING LISTS =====

// Načtení všech nákupních seznamů
async function getAllListsExample() {
  const token = localStorage.getItem('token');

  try {
    const response = await api.getAllShoppingLists(token);
    console.log('Nákupní seznamy:', response.data.shoppingLists);
    return response.data.shoppingLists;
  } catch (error) {
    console.error('Chyba při načítání seznamů:', error);
    if (error.status === 401) {
      console.log('Uživatel není přihlášen');
    }
  }
}

// Vytvoření nového seznamu
async function createListExample() {
  const token = localStorage.getItem('token');

  try {
    const response = await api.createShoppingList(token, 'Můj nový seznam');
    console.log('Seznam vytvořen:', response.data.shoppingList);
    return response.data.shoppingList;
  } catch (error) {
    console.error('Chyba při vytváření seznamu:', error);
  }
}

// Načtení detailu seznamu
async function getListDetailExample(listId) {
  const token = localStorage.getItem('token');

  try {
    const response = await api.getShoppingList(token, listId);
    console.log('Detail seznamu:', response.data.shoppingList);
    return response.data.shoppingList;
  } catch (error) {
    console.error('Chyba při načítání detailu:', error);
    if (error.status === 404) {
      console.log('Seznam nenalezen');
    }
  }
}

// ===== ITEMS =====

// Přidání položky do seznamu
async function addItemExample(listId) {
  const token = localStorage.getItem('token');

  try {
    const response = await api.addItem(token, listId, 'Mléko', 2);
    console.log('Položka přidána:', response.data.item);
    return response.data.item;
  } catch (error) {
    console.error('Chyba při přidávání položky:', error);
  }
}

// Označení položky jako splněné
async function checkItemExample(listId, itemId) {
  const token = localStorage.getItem('token');

  try {
    const response = await api.checkItem(token, listId, itemId);
    console.log('Položka označena:', response.data.item);
    return response.data.item;
  } catch (error) {
    console.error('Chyba při označování položky:', error);
  }
}

// ===== POUŽITÍ V REACT KOMPONENTÁCH =====

// Příklad v React komponentě s useState a useEffect
function ExampleComponent() {
  const [lists, setLists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await api.getAllShoppingLists(token);
      setLists(response.data.shoppingLists);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateList(name) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.createShoppingList(token, name);
      // Přidat nový seznam do stavu
      setLists([...lists, response.data.shoppingList]);
    } catch (err) {
      setError(err);
    }
  }

  if (loading) return <div>Načítání...</div>;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {lists.map(list => (
        <div key={list._id}>{list.name}</div>
      ))}
    </div>
  );
}

// ===== ZPRACOVÁNÍ CHYB =====

// Příklad komplexního zpracování chyb
async function handleApiCallWithErrors() {
  try {
    const token = localStorage.getItem('token');
    const response = await api.getAllShoppingLists(token);
    return response;
  } catch (error) {
    // error je instance ApiError
    switch (error.status) {
      case 400:
        console.error('Neplatný požadavek:', error.message);
        // Zobrazit validační chyby
        if (error.data?.errors) {
          error.data.errors.forEach(err => {
            console.error(`- ${err.msg}`);
          });
        }
        break;

      case 401:
        console.error('Nejste přihlášeni');
        // Přesměrovat na přihlášení
        window.location.href = '/login';
        break;

      case 403:
        console.error('Nemáte oprávnění');
        break;

      case 404:
        console.error('Nenalezeno');
        break;

      case 500:
      case 503:
        console.error('Chyba serveru:', error.message);
        break;

      default:
        console.error('Neznámá chyba:', error);
    }
  }
}

export {
  loginExample,
  getAllListsExample,
  createListExample,
  getListDetailExample,
  addItemExample,
  checkItemExample,
  ExampleComponent,
  handleApiCallWithErrors
};
