import express from 'express'
import { getAdminProfile, updateAdminProfile, updateAdminPassword } from '../../controllers/admin/adminProfile.controller.js'
import { adminAuth } from '../../middleware/adminAuth.middleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(adminAuth)

// GET /api/admin/profile - Get admin profile
router.get('/', getAdminProfile)

// PUT /api/admin/profile - Update admin profile (email)
router.put('/', updateAdminProfile)

// PUT /api/admin/profile/password - Update admin password
router.put('/password', updateAdminPassword)

export default router
