import express from 'express';
import userRoute from './UserRoute';
import productRoute from './ProductRoute';
import orderRoute from './OrderRoute';
import categoryRoute from './CategoryRoute';

const router = express.Router();

router.use('/users',userRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);
router.use('/categories', categoryRoute);


export default router;
