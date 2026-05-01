import express from 'express';

import * as AuthController from '../controller/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);
router.patch('/updatePassword', protect, AuthController.updatePassword);
router.get('/me', protect, AuthController.me);

export default router;