import bcrypt from 'bcryptjs';
import { connectDB } from '../lib/db.js';
import adminSchema from '../models/admin/admin.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Admin data
    const adminData = {
      adminName: "Admin User",
      adminEmail: "anki@gmail.com",
      password: "123456", // You can change this
      adminPhno: "1234567890"
    };

    // Check if admin already exists
    const existingAdmin = await adminSchema.findOne({ adminEmail: adminData.adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists with this email');
      process.exit(1);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin
    const admin = new adminSchema({
      adminName: adminData.adminName,
      adminEmail: adminData.adminEmail,
      password: hashedPassword,
      adminPhno: adminData.adminPhno
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email:', adminData.adminEmail);
    console.log('Password:', adminData.password);
    console.log('You can now login with these credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
