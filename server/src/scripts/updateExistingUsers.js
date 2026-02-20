import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user/user.model.js';
import { connectDB } from '../lib/db.js';

// Load environment variables
dotenv.config();

const updateExistingUsers = async () => {
  try {
    await connectDB();
    
    // Update all users who don't have the isPresent field
    const result = await User.updateMany(
      { isPresent: { $exists: false } },
      { 
        $set: { 
          isPresent: true,
          lastCheckIn: new Date()
        } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} users with isPresent field`);
    
    // Also update users where isPresent is null or undefined
    const result2 = await User.updateMany(
      { 
        $or: [
          { isPresent: null },
          { isPresent: undefined }
        ]
      },
      { 
        $set: { 
          isPresent: true,
          lastCheckIn: new Date()
        } 
      }
    );
    
    console.log(`Updated ${result2.modifiedCount} users with null/undefined isPresent field`);
    
    // Show all users with their isPresent status
    const allUsers = await User.find({}, 'fullName roomNo isPresent').lean();
    console.log('\nAll users with isPresent status:');
    allUsers.forEach(user => {
      console.log(`${user.fullName} - Room ${user.roomNo} - Present: ${user.isPresent}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

updateExistingUsers();
