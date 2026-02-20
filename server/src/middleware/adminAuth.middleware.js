import jwt from 'jsonwebtoken';
import adminSchema from '../models/admin/admin.model.js';


// “Are you logged in as ADMIN?”
export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.admin_jwt;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized - No Token" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        
        // Get admin from database
        const admin = await adminSchema.findById(decoded.id).select('-password');
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        req.user = admin; // Store admin data in req.user for consistency
        next();
        
    } catch (err) {
        console.error('Admin auth middleware error:', err);
        return res.status(403).json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
};

// Alternative export with different name for backward compatibility
export const adminAuth = protectedRoute;
