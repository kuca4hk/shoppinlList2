const { body, param } = require('express-validator');

const createShoppingListValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Shopping list name is required')
    .isLength({ max: 200 }).withMessage('Name cannot be more than 200 characters')
];

const updateShoppingListValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format'),

  body('name')
    .trim()
    .notEmpty().withMessage('Shopping list name is required')
    .isLength({ max: 200 }).withMessage('Name cannot be more than 200 characters')
];

const shoppingListIdValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format')
];

const inviteUserValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format'),

  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID format')
];

const removeUserValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format'),

  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID format')
];

module.exports = {
  createShoppingListValidator,
  updateShoppingListValidator,
  shoppingListIdValidator,
  inviteUserValidator,
  removeUserValidator
};
