// Počáteční data pro nákupní seznamy
export const INITIAL_SHOPPING_LISTS = [
  {
    id: '1',
    name: 'Týdenní nákup',
    owner: 'user1',
    members: ['user1', 'user2'],
    archived: false,
    items: [
      { id: '1', name: 'Mléko', quantity: 2, resolved: false },
      { id: '2', name: 'Chléb', quantity: 1, resolved: true },
      { id: '3', name: 'Máslo', quantity: 1, resolved: false },
      { id: '4', name: 'Vejce', quantity: 10, resolved: false },
      { id: '5', name: 'Sýr', quantity: 1, resolved: true },
    ]
  },
  {
    id: '2',
    name: 'Oslava narozenin',
    owner: 'user2',
    members: ['user1', 'user2', 'user3'],
    archived: false,
    items: [
      { id: '6', name: 'Dort', quantity: 1, resolved: false },
      { id: '7', name: 'Svíčky', quantity: 20, resolved: false },
      { id: '8', name: 'Nápoje', quantity: 5, resolved: true },
      { id: '9', name: 'Chipsy', quantity: 3, resolved: false },
    ]
  },
  {
    id: '3',
    name: 'Dovolená',
    owner: 'user1',
    members: ['user1', 'user3'],
    archived: true,
    items: [
      { id: '10', name: 'Opalovací krém', quantity: 1, resolved: false },
      { id: '11', name: 'Plavky', quantity: 2, resolved: false },
      { id: '12', name: 'Kniha', quantity: 1, resolved: true },
    ]
  }
];

// Simulace přihlášeného uživatele
export const CURRENT_USER = 'user1';

// Databáze uživatelů (pro zobrazení jmen)
export const USERS = {
  'user1': { id: 'user1', name: 'Jan Novák' },
  'user2': { id: 'user2', name: 'Marie Svobodová' },
  'user3': { id: 'user3', name: 'Petr Dvořák' },
};