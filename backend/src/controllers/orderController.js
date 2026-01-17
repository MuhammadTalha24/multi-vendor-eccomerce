import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
    try {
        const body = req.body || {};
        const { shippingAddress, orderItems, paymentInfo, itemPrice, shippingPrice, taxPrice, totalPrice } = body;

        if (!shippingAddress || !orderItems || orderItems.length === 0 || !paymentInfo || !itemPrice || !totalPrice || !shippingPrice || !taxPrice) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required order details."
            });
        }


        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Sorry, only ${product.stock} units of ${item.name} are available.`
                });
            }
        }



        const order = await Order.create({
            shippingAddress,
            orderItems,
            paymentInfo,
            itemPrice,
            shippingPric,
            taxPrice,
            totalPrice,
            user: req.user.id,
            createdAt: Date.now()
        })

        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            product.stock -= item.quantity;

            await product.save({ validateBeforeSave: true })
        }


        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}


export const getALlOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId });

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate({ path: 'user', select: "-password" });
        if (!order) {
            return res.status(400).json({ success: false, message: "Order Not Found" });
        }



        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}