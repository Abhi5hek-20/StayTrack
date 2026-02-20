import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // minimum length requirement
  },
  phno: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },

  studyYear: {
    type: String,
    required: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'] 
  },

  roomNo: {
    type: String,
    required: true
  },

  profilePic: {
    type: String, 
  },
  
  parentName: {
    type: String,
    required: true,
    trim: true
  },
  parentPhno: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },

  guardianName: {
    type: String,
    required: true,
    trim: true
  },

  guardianPhno: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  
  aadharNo: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{12}$/
  },
  clgId: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  
  // New fields for room management
  isPresent: {
    type: Boolean,
    default: true // Students are present by default
  },
  
  lastCheckIn: {
    type: Date,
    default: Date.now
  },
  
  lastCheckOut: {
    type: Date
  },
  
  // New fields for room management
  isPresent: {
    type: Boolean,
    default: true // Students are present by default
  },
  
  lastCheckIn: {
    type: Date,
    default: Date.now
  },
  
  lastCheckOut: {
    type: Date
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;