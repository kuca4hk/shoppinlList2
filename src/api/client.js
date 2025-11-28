const API_BASE_URL = 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      result.message || 'Něco se pokazilo',
      response.status,
      result
    );
  }

  // Pokud backend vrací data ve struktuře { status, message, data }, vrátit jen data
  if (result.data !== undefined) {
    return result.data;
  }

  return result;
}

export const api = {
  // Auth endpoints
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async register(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  async getMe(token) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Shopping List endpoints
  async getAllShoppingLists(token) {
    const response = await fetch(`${API_BASE_URL}/shoppingList`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async getShoppingList(token, listId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async createShoppingList(token, name) {
    const response = await fetch(`${API_BASE_URL}/shoppingList`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },

  async updateShoppingList(token, listId, name) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },

  async deleteShoppingList(token, listId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async archiveShoppingList(token, shoppingListId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/archive`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shoppingListId }),
    });
    return handleResponse(response);
  },

  // Items endpoints
  async getItems(token, listId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/items`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async addItem(token, listId, name, quantity) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, quantity }),
    });
    return handleResponse(response);
  },

  async updateItem(token, listId, itemId, name, quantity) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, quantity }),
    });
    return handleResponse(response);
  },

  async deleteItem(token, listId, itemId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async checkItem(token, listId, itemId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    });
    return handleResponse(response);
  },

  async uncheckItem(token, listId, itemId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/uncheck`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    });
    return handleResponse(response);
  },

  // Members endpoints
  async getMembers(token, listId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/members`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async inviteUser(token, listId, userId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  },

  async removeUser(token, listId, userId) {
    const response = await fetch(`${API_BASE_URL}/shoppingList/${listId}/members`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  },
};

export { ApiError };
