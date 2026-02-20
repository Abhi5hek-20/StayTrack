import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import adminSchema from '../../models/admin/admin.model.js';

// Admin login
export const login = async (req, res) => {
  try {
    const { adminEmail, password } = req.body;

    // Check if admin exists
    const admin = await adminSchema.findOne({ adminEmail });
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT with admin-specific secret
    const token = jwt.sign(
      { id: admin._id, role: 'admin' }, 
      process.env.JWT_ADMIN_SECRET, 
      { expiresIn: '7d' }
    );

    res.cookie("admin_jwt", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        adminName: admin.adminName,
        adminEmail: admin.adminEmail,
        adminPhno: admin.adminPhno,
        role: 'admin'
      },
    });
    
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to login admin" 
    });
  }
};

// Admin logout
export const logout = (req, res) => {
  res.clearCookie("admin_jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  res.status(200).json({ 
    success: true, 
    message: "Logout successful" 
  });
};

// Update admin profile
export const updateProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { adminName, adminEmail, adminPhno } = req.body;

    // Check if email is already taken by another admin
    if (adminEmail) {
      const existingAdmin = await adminSchema.findOne({ 
        adminEmail, 
        _id: { $ne: adminId } 
      });
      if (existingAdmin) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already in use" 
        });
      }
    }

    // Update admin profile
    const updatedAdmin = await adminSchema.findByIdAndUpdate(
      adminId,
      { adminName, adminEmail, adminPhno },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update profile" 
    });
  }
};

// Change admin password
export const changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get admin with password
    const admin = await adminSchema.findById(adminId);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await adminSchema.findByIdAndUpdate(adminId, { 
      password: hashedNewPassword 
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error('Error changing admin password:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to change password" 
    });
  }
};
