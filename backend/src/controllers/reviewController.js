import Product from "../models/Product.js";
import Review from '../models/Review.js';

export const createReview = async (req, res) => {
    try {
        const { name, rating, productId, comment } = req.body;

        console.log(req.body);
        const userId = req.user.id;
        if (!name || !rating || !comment || !productId) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        const reviewAlreadyExist = await Review.findOne({
            product: productId,
            user: userId,
        })

        if (reviewAlreadyExist) return res.status(400).json({ message: "You have already reviewed this product" })


        const review = await Review.create({
            name, rating, comment, product: productId,
            user: userId,
        })


        product.reviews.push(review._id);
        product.numOfReviews += 1;
        await product.save();


        return res.status(201).json({ message: "Review Added To The Product" });


    } catch (error) {
        console.log('error in creating review', error)
        next(error);
    }
}