import bcrypt from 'bcryptjs'
import Admin from '../../models/admin/admin.model.js'

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password')
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      })
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.adminName,
        email: admin.adminEmail,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile"
    })
  }
}

// Update admin profile (email only)
export const updateAdminProfile = async (req, res) => {
  try {
    const { email } = req.body
    const adminId = req.user._id

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      })
    }

    // Check if email is already taken by another admin
    const existingAdmin = await Admin.findOne({ 
      adminEmail: email.toLowerCase(),
      _id: { $ne: adminId }
    })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use"
      })
    }

    // Update admin profile
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { 
        adminEmail: email.toLowerCase(),
        updatedAt: new Date()
      },
      { new: true, select: '-password' }
    )

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: updatedAdmin._id,
        name: updatedAdmin.adminName,
        email: updatedAdmin.adminEmail,
        createdAt: updatedAdmin.createdAt,
        updatedAt: updatedAdmin.updatedAt
      }
    })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    res.status(500).json({
      success: false,
      message: "Failed to update admin profile"
    })
  }
}

// Update admin password
export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const adminId = req.user._id

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      })
    }

    // Get admin with password
    const admin = await Admin.findById(adminId)
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      })
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, admin.password)
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      })
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await Admin.findByIdAndUpdate(
      adminId,
      { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    )

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    })
  } catch (error) {
    console.error('Error updating admin password:', error)
    res.status(500).json({
      success: false,
      message: "Failed to update password"
    })
  }
}
