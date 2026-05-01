import express from 'express';

import * as ProductController from '../controller/ProductController';

const router = express.Router();

router.param('id', ProductController.checkValidID);
router.param('id', ProductController.checkExistID);

router.route('/')
    .get(ProductController.getAllProducts)
    .post(ProductController.CreateProduct);

router.route('/:id')
    .get(ProductController.getProduct)
    .patch(ProductController.UpdateProduct)
    .delete(ProductController.DeleteProduct);

export default router;