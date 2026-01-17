import Product from "../models/Product.js";
import Review from '../models/Review.js';
import User from '../models/User.js';

export const createReview = async (req, res) => {
    try {
        const { productId, comment, rating } = req.body;
        const userId = req.user.id;

        if (!productId || !comment || !rating) {
            return res.status(400).json({ message: "All Fields Are Required" });

        }

        const product = await Product.findById(productId);
        if (!product) return res.status(400).json({ message: "Product not found" });

        const user = await User.findById(userId);

        const alreadyReviewed = await Review.findOne({ product: product._id, user: userId });

        if (alreadyReviewed) {
            return res.status(400).json({ message: "You already reviewed that product" });
        }


        const review = await Review.create({
            user: userId,
            comment,
            rating,
            name: user.name,
            product: productId
        })

        product.reviews.push(review._id);

        product.numOfReviews = product.reviews.length;


        const reviews = await Review.find({ product: productId });

        product.ratings = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
        product.ratings = Number(product.ratings.toFixed(1));

        await product.save();


        return res.status(201).json({ message: "Review Added To The Product" })


    } catch (error) {
        console.log("Error in review Creation", error);
        return res.status(400).json({ message: "Internal Server Error" });
    }
}



export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const userId = req.user.id;


        if (!reviewId) return res.status(400).json({ success: false, message: "Review Id is required" })

        const review = await Review.findById(reviewId);

        if (!review) return res.status(400).json({ success: false, message: "Review Not Found" });

        if (review.user.toString() !== userId) {
            return res.status(400).json({ success: false, message: "You have not allowed to delete others review" })
        }

        const product = await Product.findById(review.product);

        product.reviews = product.reviews.filter(
            (id) => id.toString() !== review._id.toString()
        )

        product.numOfReviews = product.reviews.length;

        await Review.findByIdAndDelete(reviewId);


        if (product.numOfReviews === 0) {
            product.ratings = 0
        } else {
            const reviews = await Review.find({ product: product._id });
            product.ratings = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
            product.ratings = Number(product.ratings.toFixed(1));
        }


        await product.save();


        return res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        console.log("Error in deleting review", error);
        return res.status(400).json({ success: false, message: "Internal Server Error" });
    }

};



export const getAllReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const reviews = await Review.find({ product: productId });


        return res.status(200).json({ success: true, count: reviews.length, reviews });

    } catch (error) {
        console.log("Error in deleting review", error);
        return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
}