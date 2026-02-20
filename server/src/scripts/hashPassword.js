import bcrypt from 'bcryptjs';

// Change this to any password you want
const password = 'admin123';  // <-- Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Password:', password);
    console.log('Hashed:', hash);
    console.log('\nYou can copy this hash and manually update your database.');
    console.log('Admin will login using the plain password:', password);
  }
});
