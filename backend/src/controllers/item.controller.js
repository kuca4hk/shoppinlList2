const Item = require('../models/Item');
const ShoppingList = require('../models/ShoppingList');

/**
 * Get all items for a shopping list
 * @route GET /api/shoppingList/:shoppingListId/items
 */
const getItems = async (req, res, next) => {
  try {
    const shoppingListId = req.params.shoppingListId;

    const listItems = await Item.find({ shoppingListId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        count: listItems.length,
        items: listItems
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to shopping list
 * @route POST /api/shoppingList/:shoppingListId/items
 */
const addItem = async (req, res, next) => {
  try {
    const shoppingListId = req.params.shoppingListId;
    const { name, quantity } = req.body;

    const newItem = await Item.create({
      shoppingListId,
      name,
      quantity: quantity || 1,
      completed: false
    });

    // Update shopping list's updatedAt
    await ShoppingList.findByIdAndUpdate(shoppingListId, { updatedAt: new Date() });

    res.status(201).json({
      status: 'success',
      message: 'Item added successfully',
      data: {
        item: newItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an item
 * @route PATCH /api/shoppingList/:shoppingListId/items/:itemId
 */
const updateItem = async (req, res, next) => {
  try {
    const { shoppingListId, itemId } = req.params;
    const { name, quantity } = req.body;

    const item = await Item.findOne({ _id: itemId, shoppingListId });

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found.'
      });
    }

    // Update fields if provided
    if (name !== undefined) item.name = name;
    if (quantity !== undefined) item.quantity = quantity;
    item.updatedAt = new Date();

    await item.save();

    // Update shopping list's updatedAt
    await ShoppingList.findByIdAndUpdate(shoppingListId, { updatedAt: new Date() });

    res.status(200).json({
      status: 'success',
      message: 'Item updated successfully',
      data: {
        item
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an item
 * @route DELETE /api/shoppingList/:shoppingListId/items/:itemId
 */
const deleteItem = async (req, res, next) => {
  try {
    const { shoppingListId, itemId } = req.params;

    const item = await Item.findOneAndDelete({ _id: itemId, shoppingListId });

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found.'
      });
    }

    // Update shopping list's updatedAt
    await ShoppingList.findByIdAndUpdate(shoppingListId, { updatedAt: new Date() });

    res.status(200).json({
      status: 'success',
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check item on shopping list (mark as completed)
 * @route POST /api/shoppingList/:shoppingListId/check
 */
const checkItem = async (req, res, next) => {
  try {
    const shoppingListId = req.params.shoppingListId;
    const { itemId } = req.body;

    const item = await Item.findOne({ _id: itemId, shoppingListId });

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found.'
      });
    }

    item.completed = true;
    item.updatedAt = new Date();
    await item.save();

    // Update shopping list's updatedAt
    await ShoppingList.findByIdAndUpdate(shoppingListId, { updatedAt: new Date() });

    res.status(200).json({
      status: 'success',
      message: 'Item marked as completed',
      data: {
        item
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Uncheck item on shopping list (mark as not completed)
 * @route POST /api/shoppingList/:shoppingListId/uncheck
 */
const uncheckItem = async (req, res, next) => {
  try {
    const shoppingListId = req.params.shoppingListId;
    const { itemId } = req.body;

    const item = await Item.findOne({ _id: itemId, shoppingListId });

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found.'
      });
    }

    item.completed = false;
    item.updatedAt = new Date();
    await item.save();

    // Update shopping list's updatedAt
    await ShoppingList.findByIdAndUpdate(shoppingListId, { updatedAt: new Date() });

    res.status(200).json({
      status: 'success',
      message: 'Item marked as not completed',
      data: {
        item
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  checkItem,
  uncheckItem
};
