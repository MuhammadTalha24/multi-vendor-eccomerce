// middleware/error.js
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    // Agar Mongoose ki validation fail hui (min/max/required)
    if (err.name === "ValidationError") {
        // Saare errors ke messages ko aik saath join kar lo
        const message = Object.values(err.errors).map((value) => value.message).join(', ');
        err.statusCode = 400;
        err.message = message;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};