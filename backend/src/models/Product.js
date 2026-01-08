import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        default: 1
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);