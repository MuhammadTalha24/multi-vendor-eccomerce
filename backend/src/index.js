import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { dbConnection } from './utils/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import multerMiddleware from './middlewares/multerMiddleware.js';
import errorMiddleware from './middlewares/errorMiddleware.js';





dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(multerMiddleware);



app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/order', orderRoutes);


app.use(errorMiddleware);


dbConnection().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.log("DB connection error", error)
})




