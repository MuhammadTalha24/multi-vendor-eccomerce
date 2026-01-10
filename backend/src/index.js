import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { dbConnection } from './utils/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import multerMiddleware from './middlewares/multerMiddleware.js';




dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());





app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);



// Global error handler
app.use(multerMiddleware);


dbConnection().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.log("DB connection error", error)
})




