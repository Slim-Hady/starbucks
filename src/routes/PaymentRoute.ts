import express from 'express';

import * as PaymentController from '../controller/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/checkout-session/:productId', protect, PaymentController.createCheckoutSession);

export default router;