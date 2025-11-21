const bcrypt = require('bcryptjs');

// Hashované heslo pro všechny uživatele: "password123"
const hashedPassword = bcrypt.hashSync('password123', 10);

// Dummy users
const users = [
  {
    _id: '6741a1b2c3d4e5f6a7b8c9d0',
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
    createdAt: new Date('2025-01-01')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9d1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: hashedPassword,
    createdAt: new Date('2025-01-02')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9d2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: hashedPassword,
    createdAt: new Date('2025-01-03')
  }
];

// Dummy shopping lists
const shoppingLists = [
  {
    _id: '6741a1b2c3d4e5f6a7b8c9d3',
    name: 'Weekly Groceries',
    ownerId: '6741a1b2c3d4e5f6a7b8c9d0', // John
    members: ['6741a1b2c3d4e5f6a7b8c9d1'], // Jane
    archived: false,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-10')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9d4',
    name: 'Birthday Party Supplies',
    ownerId: '6741a1b2c3d4e5f6a7b8c9d1', // Jane
    members: ['6741a1b2c3d4e5f6a7b8c9d0', '6741a1b2c3d4e5f6a7b8c9d2'], // John, Bob
    archived: false,
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-11')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9d5',
    name: 'Home Improvement',
    ownerId: '6741a1b2c3d4e5f6a7b8c9d2', // Bob
    members: [],
    archived: false,
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-12')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9d6',
    name: 'Old Shopping List',
    ownerId: '6741a1b2c3d4e5f6a7b8c9d0', // John
    members: [],
    archived: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15')
  }
];

// Dummy items
const items = [
  // Weekly Groceries items
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e0',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d3',
    name: 'Milk',
    quantity: 2,
    completed: false,
    createdAt: new Date('2025-01-10T10:00:00'),
    updatedAt: new Date('2025-01-10T10:00:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e1',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d3',
    name: 'Bread',
    quantity: 1,
    completed: true,
    createdAt: new Date('2025-01-10T10:05:00'),
    updatedAt: new Date('2025-01-10T15:30:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e2',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d3',
    name: 'Eggs',
    quantity: 12,
    completed: false,
    createdAt: new Date('2025-01-10T10:10:00'),
    updatedAt: new Date('2025-01-10T10:10:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e3',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d3',
    name: 'Butter',
    quantity: 1,
    completed: false,
    createdAt: new Date('2025-01-10T10:15:00'),
    updatedAt: new Date('2025-01-10T10:15:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e4',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d3',
    name: 'Cheese',
    quantity: 1,
    completed: true,
    createdAt: new Date('2025-01-10T10:20:00'),
    updatedAt: new Date('2025-01-10T16:00:00')
  },

  // Birthday Party Supplies items
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e5',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d4',
    name: 'Balloons',
    quantity: 50,
    completed: false,
    createdAt: new Date('2025-01-11T09:00:00'),
    updatedAt: new Date('2025-01-11T09:00:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e6',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d4',
    name: 'Cake',
    quantity: 1,
    completed: false,
    createdAt: new Date('2025-01-11T09:05:00'),
    updatedAt: new Date('2025-01-11T09:05:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e7',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d4',
    name: 'Candles',
    quantity: 1,
    completed: true,
    createdAt: new Date('2025-01-11T09:10:00'),
    updatedAt: new Date('2025-01-11T14:00:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e8',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d4',
    name: 'Party Hats',
    quantity: 20,
    completed: false,
    createdAt: new Date('2025-01-11T09:15:00'),
    updatedAt: new Date('2025-01-11T09:15:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9e9',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d4',
    name: 'Drinks',
    quantity: 10,
    completed: false,
    createdAt: new Date('2025-01-11T09:20:00'),
    updatedAt: new Date('2025-01-11T09:20:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9ea',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d4',
    name: 'Plates and Cups',
    quantity: 30,
    completed: true,
    createdAt: new Date('2025-01-11T09:25:00'),
    updatedAt: new Date('2025-01-11T15:00:00')
  },

  // Home Improvement items
  {
    _id: '6741a1b2c3d4e5f6a7b8c9eb',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d5',
    name: 'Paint',
    quantity: 5,
    completed: false,
    createdAt: new Date('2025-01-12T08:00:00'),
    updatedAt: new Date('2025-01-12T08:00:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9ec',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d5',
    name: 'Paint Brushes',
    quantity: 3,
    completed: false,
    createdAt: new Date('2025-01-12T08:05:00'),
    updatedAt: new Date('2025-01-12T08:05:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9ed',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d5',
    name: 'Screwdriver Set',
    quantity: 1,
    completed: false,
    createdAt: new Date('2025-01-12T08:10:00'),
    updatedAt: new Date('2025-01-12T08:10:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9ee',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d5',
    name: 'Nails',
    quantity: 100,
    completed: true,
    createdAt: new Date('2025-01-12T08:15:00'),
    updatedAt: new Date('2025-01-12T13:00:00')
  },

  // Old Shopping List items
  {
    _id: '6741a1b2c3d4e5f6a7b8c9ef',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d6',
    name: 'Old Item 1',
    quantity: 1,
    completed: true,
    createdAt: new Date('2024-12-01T10:00:00'),
    updatedAt: new Date('2024-12-05T10:00:00')
  },
  {
    _id: '6741a1b2c3d4e5f6a7b8c9f0',
    shoppingListId: '6741a1b2c3d4e5f6a7b8c9d6',
    name: 'Old Item 2',
    quantity: 1,
    completed: true,
    createdAt: new Date('2024-12-01T10:05:00'),
    updatedAt: new Date('2024-12-05T10:05:00')
  }
];

// Export data and helper functions
module.exports = {
  users,
  shoppingLists,
  items,

  // Helper to generate new ID (MongoDB ObjectId format - 24 hex characters)
  generateId: () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
    const randomPart = Math.random().toString(16).substring(2, 18).padEnd(16, '0');
    return timestamp + randomPart;
  },

  // Helper to find user by email
  findUserByEmail: (email) => {
    return users.find(u => u.email === email);
  },

  // Helper to find user by id
  findUserById: (id) => {
    return users.find(u => u._id === id);
  },

  // Helper to check if list belongs to user (owner or member)
  hasListAccess: (listId, userId) => {
    const list = shoppingLists.find(l => l._id === listId);
    if (!list) return false;
    return list.ownerId === userId || list.members.includes(userId);
  },

  // Helper to check if user is owner
  isListOwner: (listId, userId) => {
    const list = shoppingLists.find(l => l._id === listId);
    if (!list) return false;
    return list.ownerId === userId;
  }
};
