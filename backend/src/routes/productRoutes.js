import express from 'express';
import { createProduct, deleteProduct, editProduct, getAllProducts, getProductDetail } from '../controllers/productController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js'

import upload from '../utils/multer.js';
const Router = express.Router();




Router.post('/create', protect, authorize('seller', 'admin'), upload.array('images', 5), createProduct);
Router.patch('/update/:id', protect, authorize('seller', 'admin'), upload.array('images', 5), editProduct);
Router.delete('/delete/:id', protect, authorize('seller', 'admin'), deleteProduct);

Router.get('/all', getAllProducts);
Router.get('/:id', getProductDetail);




export default Router;