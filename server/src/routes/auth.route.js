import express from "express";
import { authMe } from "../middleware/authMe.middleware.js";

const router = express.Router();

// GLOBAL check-auth
router.get("/", authMe, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user // It has role 
  });
});

export default router;
