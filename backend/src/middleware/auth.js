const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const ShoppingList = require('../models/ShoppingList');

/**
 * Middleware to authenticate user using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided. Please authenticate.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found. Token is invalid.'
      });
    }

    // Attach user to request (without password)
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please authenticate.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please authenticate again.'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed.'
    });
  }
};

/**
 * Middleware to check if user is owner of shopping list
 */
const isShoppingListOwner = async (req, res, next) => {
  try {
    const shoppingListId = req.params.shoppingListId || req.params.id || req.body.shoppingListId;

    if (!shoppingListId) {
      return res.status(400).json({
        status: 'error',
        message: 'Shopping list ID is required.'
      });
    }

    const shoppingList = await ShoppingList.findById(shoppingListId);

    if (!shoppingList) {
      return res.status(404).json({
        status: 'error',
        message: 'Shopping list not found.'
      });
    }

    if (shoppingList.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized. Only the owner can perform this action.'
      });
    }

    // Attach shopping list to request for future use
    req.shoppingList = shoppingList;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Authorization check failed.'
    });
  }
};

/**
 * Middleware to check if user is owner or member of shopping list
 */
const isShoppingListMemberOrOwner = async (req, res, next) => {
  try {
    const shoppingListId = req.params.shoppingListId || req.params.id || req.body.shoppingListId || req.query.shoppingListId;

    if (!shoppingListId) {
      return res.status(400).json({
        status: 'error',
        message: 'Shopping list ID is required.'
      });
    }

    const shoppingList = await ShoppingList.findById(shoppingListId);

    if (!shoppingList) {
      return res.status(404).json({
        status: 'error',
        message: 'Shopping list not found.'
      });
    }

    const isOwner = shoppingList.ownerId.toString() === req.user._id.toString();
    const isMember = shoppingList.members.some(memberId => memberId.toString() === req.user._id.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized. You must be owner or member of this shopping list.'
      });
    }

    // Attach shopping list to request for future use
    req.shoppingList = shoppingList;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Authorization check failed.'
    });
  }
};

module.exports = {
  authenticate,
  isShoppingListOwner,
  isShoppingListMemberOrOwner
};
