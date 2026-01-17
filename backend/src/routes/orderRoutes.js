import express from 'express';
import { authorize, protect } from '../middlewares/authMiddleware.js';
import { createOrder, getALlOrders, getOrderDetail } from '../controllers/orderController.js';
const router = express.Router();

router.get('/all', protect, authorize('customer'), getALlOrders)
router.get('/:id', protect, authorize('customer'), getOrderDetail)
router.post('/create', protect, authorize('customer'), createOrder);

export default router;