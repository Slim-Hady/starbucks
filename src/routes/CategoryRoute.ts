import express from 'express';

import * as CategoryController from '../controller/CategoryController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.param('id', CategoryController.checkValidID);
router.param('id', CategoryController.checkExistID);

router.route('/')
    .get(CategoryController.getAllCategories)
    .post(protect, restrictTo('Admin'), CategoryController.CreateCategory);

router.route('/:id')
    .get(CategoryController.getCategory)
    .patch(protect, restrictTo('Admin'), CategoryController.UpdateCategory)
    .delete(protect, restrictTo('Admin'), CategoryController.DeleteCategory);

export default router;