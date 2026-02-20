
import jwt from "jsonwebtoken";
import User from "../models/user/user.model.js"; 


// “Are you logged in as USER?”
export const protectedRoute = async (req, res, next) => {
    try{
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.jwt;
        
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // find the user by id
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Error in protectedRoute middleware:", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token format" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(500).json({ message: "Server error" });
    }

}