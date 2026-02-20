import express from 'express';
import {login, logout, updateProfile, changePassword } from '../../controllers/admin/adminAuth.controller.js';  
import { protectedRoute } from '../../middleware/adminAuth.middleware.js'; 

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);
router.put("/change-password", protectedRoute, changePassword);

export default router;