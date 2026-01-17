import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createReview, deleteReview, getAllReviews } from '../controllers/reviewController.js';

const router = express.Router();


router.get('/:id', getAllReviews);
router.post('/create', protect, createReview)
router.delete('/delete', protect, deleteReview);



export default router;