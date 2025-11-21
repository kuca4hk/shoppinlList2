const ShoppingList = require('../models/ShoppingList');
const Item = require('../models/Item');

/**
 * Get all shopping lists for current user
 * @route GET /api/shoppingList/
 */
const getAllShoppingLists = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all shopping lists where user is owner or member
    const userLists = await ShoppingList.find({
      $or: [
        { ownerId: userId },
        { members: userId }
      ]
    })
      .populate('ownerId', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        count: userLists.length,
        shoppingLists: userLists
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new shopping list
 * @route POST /api/shoppingList/
 */
const createShoppingList = async (req, res, next) => {
  try {
    const { name } = req.body;
    const ownerId = req.user._id;

    const newList = await ShoppingList.create({
      name,
      ownerId,
      members: [],
      archived: false
    });

    // Populate owner
    await newList.populate('ownerId', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Shopping list created successfully',
      data: {
        shoppingList: newList
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get one shopping list by ID
 * @route GET /api/shoppingList/:shoppingListId
 */
const getShoppingList = async (req, res, next) => {
  try {
    const list = await ShoppingList.findById(req.shoppingList._id)
      .populate('ownerId', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        shoppingList: list
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update shopping list
 * @route PATCH /api/shoppingList/:shoppingListId
 */
const updateShoppingList = async (req, res, next) => {
  try {
    const { name } = req.body;

    const updatedList = await ShoppingList.findByIdAndUpdate(
      req.shoppingList._id,
      { name, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('ownerId', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'Shopping list updated successfully',
      data: {
        shoppingList: updatedList
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a shopping list (only owner)
 * @route DELETE /api/shoppingList/:shoppingListId
 */
const deleteShoppingList = async (req, res, next) => {
  try {
    const shoppingListId = req.params.shoppingListId;

    // Remove all items in this shopping list
    await Item.deleteMany({ shoppingListId });

    // Remove shopping list
    await ShoppingList.findByIdAndDelete(shoppingListId);

    res.status(200).json({
      status: 'success',
      message: 'Shopping list and all its items deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Archive shopping list
 * @route POST /api/shoppingList/archive
 */
const archiveShoppingList = async (req, res, next) => {
  try {
    const { shoppingListId } = req.body;

    const list = await ShoppingList.findById(shoppingListId);

    if (!list) {
      return res.status(404).json({
        status: 'error',
        message: 'Shopping list not found.'
      });
    }

    if (list.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the owner can archive this shopping list.'
      });
    }

    list.archived = true;
    list.updatedAt = new Date();
    await list.save();

    // Populate owner and members
    await list.populate('ownerId', 'name email');
    await list.populate('members', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'Shopping list archived successfully',
      data: {
        shoppingList: list
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Invite user to shopping list (only owner)
 * @route POST /api/shoppingList/:shoppingListId/invite
 */
const inviteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const User = require('../models/User');

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.'
      });
    }

    const list = req.shoppingList;

    // Check if user is already a member
    if (list.members.some(memberId => memberId.toString() === userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already a member of this shopping list.'
      });
    }

    // Check if user is the owner
    if (list.ownerId.toString() === userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Owner is automatically a member.'
      });
    }

    // Add user to members
    list.members.push(userId);
    list.updatedAt = new Date();
    await list.save();

    // Populate owner and members
    await list.populate('ownerId', 'name email');
    await list.populate('members', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'User invited successfully',
      data: {
        shoppingList: list
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get members of shopping list
 * @route GET /api/shoppingList/:shoppingListId/members
 */
const getMembers = async (req, res, next) => {
  try {
    const list = await ShoppingList.findById(req.shoppingList._id)
      .populate('ownerId', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        owner: list.ownerId,
        members: list.members,
        totalMembers: list.members.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove user from shopping list (only owner)
 * @route DELETE /api/shoppingList/:shoppingListId/members
 */
const removeUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const list = req.shoppingList;

    // Check if user is a member
    if (!list.members.some(memberId => memberId.toString() === userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'User is not a member of this shopping list.'
      });
    }

    // Remove user from members
    list.members = list.members.filter(memberId => memberId.toString() !== userId);
    list.updatedAt = new Date();
    await list.save();

    // Populate owner and members
    await list.populate('ownerId', 'name email');
    await list.populate('members', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'User removed successfully',
      data: {
        shoppingList: list
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllShoppingLists,
  createShoppingList,
  getShoppingList,
  updateShoppingList,
  deleteShoppingList,
  archiveShoppingList,
  inviteUser,
  getMembers,
  removeUser
};
