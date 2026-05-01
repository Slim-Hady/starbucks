import express from 'express';

import * as ProductController from '../controller/ProductController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.param('id', ProductController.checkValidID);
router.param('id', ProductController.checkExistID);

router.route('/')
    .get(ProductController.getAllProducts)
    .post(protect, restrictTo('Admin'), ProductController.CreateProduct);

router.route('/:id')
    .get(ProductController.getProduct)
    .patch(protect, restrictTo('Admin'), ProductController.UpdateProduct)
    .delete(protect, restrictTo('Admin'), ProductController.DeleteProduct);

export default router;