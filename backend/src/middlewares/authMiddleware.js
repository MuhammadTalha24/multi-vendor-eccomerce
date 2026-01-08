import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    let token = req.cookies.token; // Hum cookies use kar rahe hain security ke liye

    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(410).json({ message: "Token failed" });
    }
};

// Role Check Middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        next();
    };
};

