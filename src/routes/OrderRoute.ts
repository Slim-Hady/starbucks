import express from 'express';

import * as OrderController from '../controller/OrderController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.param('id', OrderController.checkValidID);
router.param('id', OrderController.checkExistID);

router.route('/')
    .get(protect, restrictTo('Admin'), OrderController.getAllOrders)
    .post(protect, OrderController.CreateOrder);

router.route('/:id')
    .get(protect, restrictTo('Admin'), OrderController.getOrder)
    .patch(protect, restrictTo('Admin'), OrderController.UpdateOrder)
    .delete(protect, restrictTo('Admin'), OrderController.DeleteOrder);

export default router;