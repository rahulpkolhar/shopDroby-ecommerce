const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./model/user');
const Product = require('./model/product');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        verified: true,
      },
      {
        name: 'Normal User',
        email: 'user@example.com',
        password: userPassword,
        role: 'user',
        verified: true,
      },
    ];

    const insertedUsers = await User.insertMany(users);

    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Noise-cancelling wireless headphones with 20-hour battery life.',
        price: 1999,
        category: 'Electronics',
        stock: 25,
        imageurl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: 'Smart Watch',
        description: 'Fitness smart watch with heart-rate tracking and AMOLED display.',
        price: 2499,
        category: 'Wearables',
        stock: 18,
        imageurl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        rating: 4.2,
        numReviews: 9,
      },
      {
        name: 'Office Chair',
        description: 'Ergonomic chair with lumbar support for long working sessions.',
        price: 4999,
        category: 'Furniture',
        stock: 10,
        imageurl: 'https://images.unsplash.com/photo-1586158291808-4b2d6ca06e9f?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        numReviews: 15,
      },
    ];

    await Product.insertMany(products);

    console.log('Seed data inserted successfully');
    console.log('Users inserted:', insertedUsers.length);
    console.log('Products inserted:', products.length);
  } catch (error) {
    console.error('Seed failed:', error.message);
  }
};

seedData();
