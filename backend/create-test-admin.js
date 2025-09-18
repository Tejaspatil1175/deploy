import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import Admin from './models/Admin.js';
import bcrypt from 'bcrypt';

const envPath = path.resolve(process.cwd(), 'config', 'config.env');
dotenv.config({ path: envPath });

async function createTestAdmin() {
  try {
    await connectDB();
    
    const email = 'admin@disaster.com';
    const password = 'admin123';
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Test admin already exists:', email);
      process.exit(0);
    }
    
    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name: 'Test Admin',
      email: email,
      password: hashedPassword
    });
    
    console.log('Test admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Admin ID:', admin._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test admin:', error);
    process.exit(1);
  }
}

createTestAdmin();
