import * as UserController from "../controller/UserController";
import { protect, restrictTo } from '../middleware/authMiddleware';

import express from 'express';
const router = express.Router();

router.param("id" , UserController.checkValidID);
router.param("id" , UserController.checkExistID);


router.route('/')
  .get(protect, restrictTo('Admin'), UserController.getAllUsers)
  .post(protect, restrictTo('Admin'), UserController.CreateUser)

router.route('/:id')
  .get(protect, restrictTo('Admin'), UserController.getUser)
  .patch(protect, restrictTo('Admin'), UserController.UpdateUser)
  .delete(protect, restrictTo('Admin'), UserController.DeleteUser)

export default router;
