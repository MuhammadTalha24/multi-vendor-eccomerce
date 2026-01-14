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


// export const getAllProducts = async (req, res) => {
//     try {
//         const products = await Product.find();
//         return res.status(200).json({ success: true, products });
//     } catch (error) {
//         console.log("Error in creating product", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }


export const getAllProducts = async (req, res) => {
    try {

        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const minStock = req.query.minStock;
        const maxStock = req.query.maxStock;
        const category = req.query.category;

        const limit = Number(req.query.limit) || 3;
        const page = req.query.page || 1;

        const skip = (page - 1) * limit;

        const filter = {};

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }


        if (minStock || maxStock) {
            filter.stock = {};

            if (minStock) filter.stock.$gte = Number(minStock);
            if (maxStock) filter.stock.$lte = Number(maxStock);
        }

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            products,
            page
        })

    } catch (error) {
        console.log("Error in creating product", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




export const getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ message: "Product Not Found!" })
        }
        return res.status(200).json({ success: true, product });
    } catch (error) {
        console.log("Error in creating product", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}