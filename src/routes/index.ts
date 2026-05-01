import express from 'express';
import authRoute from './AuthRoute';
import userRoute from './UserRoute';
import productRoute from './ProductRoute';
import orderRoute from './OrderRoute';
import categoryRoute from './CategoryRoute';
import paymentRoute from './PaymentRoute';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users',userRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);
router.use('/categories', categoryRoute);
router.use('/payments', paymentRoute);


export default router;
