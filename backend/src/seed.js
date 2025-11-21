require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const ShoppingList = require('./models/ShoppingList');
const Item = require('./models/Item');
const { users, shoppingLists, items } = require('./data/dummy-data');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await ShoppingList.deleteMany({});
    await Item.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert users
    console.log('👥 Inserting users...');
    const insertedUsers = await User.insertMany(users);
    console.log(`✅ Inserted ${insertedUsers.length} users:`);
    insertedUsers.forEach(u => console.log(`   - ${u.name} (${u.email})`));
    console.log('');

    // Insert shopping lists
    console.log('📝 Inserting shopping lists...');
    const insertedLists = await ShoppingList.insertMany(shoppingLists);
    console.log(`✅ Inserted ${insertedLists.length} shopping lists:`);
    insertedLists.forEach(l => console.log(`   - ${l.name}`));
    console.log('');

    // Insert items
    console.log('🛒 Inserting items...');
    const insertedItems = await Item.insertMany(items);
    console.log(`✅ Inserted ${insertedItems.length} items\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Users: ${insertedUsers.length}`);
    console.log(`   Shopping Lists: ${insertedLists.length}`);
    console.log(`   Items: ${insertedItems.length}\n`);

    console.log('🔐 Test accounts (all passwords: "password123"):');
    insertedUsers.forEach(u => {
      console.log(`   Email: ${u.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();