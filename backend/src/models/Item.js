const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  shoppingListId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShoppingList',
    required: [true, 'Shopping list ID is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;