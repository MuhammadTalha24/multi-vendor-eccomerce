import mongoose from "mongoose";


const orderSchema = mongoose.Schema({
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        phoneNo: { type: String, required: true }
    },
    orderItems: [
        {
            name: { type: String, requried: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

        }
    ],
    paymentInfo: {
        transaction_id: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'paid'],
            default: 'pending'
        }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "completed"],
        default: "pending"
    },
    createdAt: { type: Date, default: Date.now() }

})


const Order = mongoose.model('Order', orderSchema);

export default Order;