import express from 'express';

import * as OrderController from '../controller/OrderController';

const router = express.Router();

router.param('id', OrderController.checkValidID);
router.param('id', OrderController.checkExistID);

router.route('/')
    .get(OrderController.getAllOrders)
    .post(OrderController.CreateOrder);

router.route('/:id')
    .get(OrderController.getOrder)
    .patch(OrderController.UpdateOrder)
    .delete(OrderController.DeleteOrder);

export default router;