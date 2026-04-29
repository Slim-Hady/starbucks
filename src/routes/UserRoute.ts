import * as UserController from "../controller/UserController";

import express from 'express';
const router = express.Router();

router.route('/')
  .get(UserController.getAllUsers)

export default router;
