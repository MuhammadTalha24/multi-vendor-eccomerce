import express from 'express';
import { createReview } from '../controllers/reviewController.js';
import { authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/create', authorize, createReview);

export default router;