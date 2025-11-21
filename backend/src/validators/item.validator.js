const { body, param } = require('express-validator');

const addItemValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format'),

  body('name')
    .trim()
    .notEmpty().withMessage('Item name is required')
    .isLength({ max: 200 }).withMessage('Item name cannot be more than 200 characters'),

  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const itemIdValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format'),

  param('itemId')
    .notEmpty().withMessage('Item ID is required')
    .isMongoId().withMessage('Invalid item ID format')
];

const updateItemValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format'),

  param('itemId')
    .notEmpty().withMessage('Item ID is required')
    .isMongoId().withMessage('Invalid item ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Item name cannot be more than 200 characters'),

  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const checkItemValidator = [
  param('shoppingListId')
    .notEmpty().withMessage('Shopping list ID is required')
    .isMongoId().withMessage('Invalid shopping list ID format'),

  body('itemId')
    .notEmpty().withMessage('Item ID is required')
    .isMongoId().withMessage('Invalid item ID format')
];

module.exports = {
  addItemValidator,
  itemIdValidator,
  updateItemValidator,
  checkItemValidator
};
