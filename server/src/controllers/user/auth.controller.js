import User  from "../../models/user/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function signUp(req, res) {
    try {
        const { 
            fullName, 
            email, 
            password, 
            phno, 
            studyYear,
            roomNo, 
            parentName,
            parentPhno,
            guardianName,
            guardianPhno,
            aadharNo, 
            clgId, 
            address 
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !phno || !studyYear || !roomNo || 
            !parentName || !parentPhno || !guardianName || !guardianPhno || 
            !aadharNo || !clgId || !address) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }
     
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phno,
            studyYear,
            roomNo,
            parentName,
            parentPhno,
            guardianName,
            guardianPhno,
            aadharNo,
            clgId,
            address
        });

        // console.log("User created successfully:", newUser);

        // create JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token,{
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ success: true, message: "User registered successfully", user: {...newUser._doc, password: undefined, role:"user"}, });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });


        res.status(200).json({ success: true, user: { ...user._doc, password: undefined, role:"user" } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function logout(req, res) {
    res.clearCookie('jwt');
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function updateProfile(req, res) {
    try {
        const { email } = req.body;
        const userId = req.user._id;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { email },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Find user and include password for verification
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}