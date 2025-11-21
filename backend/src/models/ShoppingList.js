const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shopping list name is required'],
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;