const express = require('express');
const router = express.Router();
const {
  getAllShoppingLists,
  createShoppingList,
  getShoppingList,
  updateShoppingList,
  deleteShoppingList,
  archiveShoppingList,
  inviteUser,
  getMembers,
  removeUser
} = require('../controllers/shoppingList.controller');
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  checkItem,
  uncheckItem
} = require('../controllers/item.controller');
const {
  createShoppingListValidator,
  updateShoppingListValidator,
  shoppingListIdValidator,
  inviteUserValidator,
  removeUserValidator
} = require('../validators/shoppingList.validator');
const {
  addItemValidator,
  itemIdValidator,
  updateItemValidator,
  checkItemValidator
} = require('../validators/item.validator');
const validate = require('../middleware/validate');
const {
  authenticate,
  isShoppingListOwner,
  isShoppingListMemberOrOwner
} = require('../middleware/auth');

// Shopping List routes

/**
 * @route   GET /api/shoppingList/
 * @desc    Get all shopping lists for current user
 * @access  Private (Owner, Member)
 */
router.get('/', authenticate, getAllShoppingLists);

/**
 * @route   POST /api/shoppingList/
 * @desc    Create a new shopping list
 * @access  Private (Owner)
 */
router.post('/', authenticate, createShoppingListValidator, validate, createShoppingList);

/**
 * @route   POST /api/shoppingList/archive
 * @desc    Archive a shopping list
 * @access  Private (Owner only)
 */
router.post('/archive', authenticate, archiveShoppingList);

/**
 * @route   GET /api/shoppingList/:shoppingListId
 * @desc    Get one shopping list by ID
 * @access  Private (Owner, Member)
 */
router.get('/:shoppingListId', authenticate, shoppingListIdValidator, validate, isShoppingListMemberOrOwner, getShoppingList);

/**
 * @route   PATCH /api/shoppingList/:shoppingListId
 * @desc    Update shopping list
 * @access  Private (Owner only)
 */
router.patch('/:shoppingListId', authenticate, updateShoppingListValidator, validate, isShoppingListOwner, updateShoppingList);

/**
 * @route   DELETE /api/shoppingList/:shoppingListId
 * @desc    Delete a shopping list
 * @access  Private (Owner only)
 */
router.delete('/:shoppingListId', authenticate, shoppingListIdValidator, validate, isShoppingListOwner, deleteShoppingList);

// Member management routes

/**
 * @route   POST /api/shoppingList/:shoppingListId/invite
 * @desc    Invite user to shopping list
 * @access  Private (Owner only)
 */
router.post('/:shoppingListId/invite', authenticate, inviteUserValidator, validate, isShoppingListOwner, inviteUser);

/**
 * @route   GET /api/shoppingList/:shoppingListId/members
 * @desc    Get members of shopping list
 * @access  Private (Owner, Member)
 */
router.get('/:shoppingListId/members', authenticate, shoppingListIdValidator, validate, isShoppingListMemberOrOwner, getMembers);

/**
 * @route   DELETE /api/shoppingList/:shoppingListId/members
 * @desc    Remove user from shopping list
 * @access  Private (Owner only)
 */
router.delete('/:shoppingListId/members', authenticate, removeUserValidator, validate, isShoppingListOwner, removeUser);

// Item routes

/**
 * @route   GET /api/shoppingList/:shoppingListId/items
 * @desc    Get all items for a shopping list
 * @access  Private (Owner, Member)
 */
router.get('/:shoppingListId/items', authenticate, shoppingListIdValidator, validate, isShoppingListMemberOrOwner, getItems);

/**
 * @route   POST /api/shoppingList/:shoppingListId/items
 * @desc    Add item to shopping list
 * @access  Private (Owner, Member)
 */
router.post('/:shoppingListId/items', authenticate, addItemValidator, validate, isShoppingListMemberOrOwner, addItem);

/**
 * @route   PATCH /api/shoppingList/:shoppingListId/items/:itemId
 * @desc    Update an item
 * @access  Private (Owner, Member)
 */
router.patch('/:shoppingListId/items/:itemId', authenticate, updateItemValidator, validate, isShoppingListMemberOrOwner, updateItem);

/**
 * @route   DELETE /api/shoppingList/:shoppingListId/items/:itemId
 * @desc    Delete an item
 * @access  Private (Owner, Member)
 */
router.delete('/:shoppingListId/items/:itemId', authenticate, itemIdValidator, validate, isShoppingListMemberOrOwner, deleteItem);

/**
 * @route   POST /api/shoppingList/:shoppingListId/check
 * @desc    Check item on shopping list (mark as completed)
 * @access  Private (Owner, Member)
 */
router.post('/:shoppingListId/check', authenticate, checkItemValidator, validate, isShoppingListMemberOrOwner, checkItem);

/**
 * @route   POST /api/shoppingList/:shoppingListId/uncheck
 * @desc    Uncheck item on shopping list (mark as not completed)
 * @access  Private (Owner, Member)
 */
router.post('/:shoppingListId/uncheck', authenticate, checkItemValidator, validate, isShoppingListMemberOrOwner, uncheckItem);

module.exports = router;
