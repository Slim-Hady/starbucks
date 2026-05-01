import express from 'express';

import * as CategoryController from '../controller/CategoryController';

const router = express.Router();

router.param('id', CategoryController.checkValidID);
router.param('id', CategoryController.checkExistID);

router.route('/')
    .get(CategoryController.getAllCategories)
    .post(CategoryController.CreateCategory);

router.route('/:id')
    .get(CategoryController.getCategory)
    .patch(CategoryController.UpdateCategory)
    .delete(CategoryController.DeleteCategory);

export default router;