import Product from '../models/Product.js';
import Cloudinary from '../utils/cloudinary.js';

export const createProduct = async (req, res) => {
    try {

        const body = req.body || {};
        const { name, description, price, category, stock } = body;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Ensure req.files exists
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Please upload at least one product image",
            });
        }

        const images = req.files.map(file => ({
            public_id: file.filename,
            url: file.path
        }));


        const product = await Product.create({
            name,
            description,
            price,
            category,
            images,
            stock,
            seller: req.user.id

        })

        res.status(201).json({ message: "Product Added Successfully", product });

    } catch (error) {
        console.log("Error in creating product", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const editProduct = async (req, res) => {
    try {

        const body = req.body || {};
        const { name, description, price, category, stock } = body;


        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(id);

        if (!product) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock) product.stock = stock;


        if (req.files && req.files.length > 0) {


            for (const img of product.images) {


                const result = await Cloudinary.uploader.destroy(img.public_id);
                console.log(result);
            }

            const images = req.files.map(file => ({
                public_id: file.filename,
                url: file.path
            }));


            product.images = images;

        }


        await product.save();

        return res.status(200).json({
            message: "Product Updated Successfully",
            product
        })



    } catch (error) {
        console.log("Error in creating product", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        for (const img of product.images) {
            await Cloudinary.uploader.destroy(img.public_id);
        }

        await product.deleteOne();

        return res.status(200).json({ message: "Product Deleted Successfully" })

    } catch (error) {
        console.log("Error in creating product", error);

        res.status(500).json({ message: "Internal Server Error" });

    }
}