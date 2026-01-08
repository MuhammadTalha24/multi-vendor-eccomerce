import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


export const register = async (req, res) => {
    try {

        const { name, email, password, role, shopName } = req.body;


        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" })
        }



        if (role !== "customer" && role !== "seller" && role !== "admin") {
            return res.status(400).json({ message: "Invalid role" })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role, shopName: role === 'seller' ? shopName : undefined })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            message: "Account Registered Successfully", user: {
                name: user.name,
                email: user.email,
                role: user.role,
                _id: user._id
            }, token
        })


    } catch (error) {
        console.log("Error in register controller:", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful", user: {
                name: user.name,
                email: user.email,
                role: user.role,
                _id: user._id
            }, token
        })


    } catch (error) {
        console.log("Error in register controller:", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0
        });

        return res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.log("Error in logout controller:", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}



export const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }


        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetPasswordUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`;


        return res.status(200).json({ message: "Password reset email sent successfully", resetPasswordUrl })

    } catch (error) {
        console.log("Error in forgotPassword controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const resetPassword = async (req, res) => {
    try {

        const token = req.params.token;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await User.findOne({ _id: decoded.id, resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });


        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
        console.log("Error in forgotPassword controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.status(200).json(user);


    } catch (error) {
        console.log("Error in forgotPassword controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}