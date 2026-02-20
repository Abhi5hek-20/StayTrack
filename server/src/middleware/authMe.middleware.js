import jwt from "jsonwebtoken";
import User from "../models/user/user.model.js";
import Admin from "../models/admin/admin.model.js";

// WHO ARE YOU? (USER or ADMIN)
export const authMe = async (req, res, next) => {
  try {
    /* 1️⃣ Check ADMIN first */
    const adminToken = req.cookies.admin_jwt;

    if (adminToken) {
      const decoded = jwt.verify(
        adminToken,
        process.env.JWT_ADMIN_SECRET
      );

      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin not found"
        });
      }

      // Attach admin + role
      req.user = {
        ...admin._doc,
        role: "admin"
      };

      return next();
    }

    /* ===============================
       2️⃣ Check USER
       =============================== */
    const userToken = req.cookies.jwt;
    
    if (userToken) {
      const decoded = jwt.verify(
        userToken,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      // Attach user + role
      req.user = {
        ...user._doc,
        role: "user"
      };

      return next();
    }

    /* ===============================
       3️⃣ No token found
       =============================== */
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });

  } catch (error) {
    console.error("authMe middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
