import express from 'express';
import { signUp, login, logout, updateProfile, changePassword } from '../../controllers/user/auth.controller.js';  
import { protectedRoute } from '../../middleware/auth.middleware.js'; 

const router = express.Router();

// Public routes
router.post("/signUp", signUp);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);
router.put("/change-password", protectedRoute, changePassword);
export default router;
