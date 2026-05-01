import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import Email from '../utils/email';
import { User } from '../models/User';

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions);
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
    const token = signToken(user._id.toString());
    const cookieOptions = {
        expires: new Date(Date.now() + (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    const welcomeUrl = process.env.WELCOME_URL || 'http://localhost:3000';
    await new Email(user.email, user.name, welcomeUrl).sendWelcome().catch(() => null);

    createSendToken(user, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await (user as any).correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

export const me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById((req as any).user._id).select('+password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (!(await (user as any).correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    user.password = req.body.password;
    await user.save();

    createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    await new Email(user.email, user.name, resetUrl).sendPasswordReset().catch(() => null);

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
    });
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto.createHash('sha256').update(String(req.params.token)).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});