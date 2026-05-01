import { request } from "node:http";
import * as UserController from "../controller/UserController";

import express from 'express';
const router = express.Router();

router.param("id" , UserController.checkValidID);
router.param("id" , UserController.checkExistID);


router.route('/')
  .get(UserController.getAllUsers)
  .post(UserController.CreateUser)

router.route('/:id')
  .get(UserController.getUser)
  .patch(UserController.UpdateUser)
  .delete(UserController.DeleteUser)

export default router;
