import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import AppError from '../utils/AppError';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        let token = req.cookies?.jwt;

        if (!token && authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in. Please log in to get access.', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; iat: number };
        const currentUser = await User.findById(decoded.id).select('+passwordChangedAt +password +passwordResetToken +passwordResetExpires');

        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }

        if ((currentUser as any).changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password. Please log in again.', 401));
        }

        (req as any).user = currentUser;
        next();
    } catch (err: any) {
        next(new AppError(err.message || 'Authentication failed', 401));
    }
};

export const restrictTo = (...roles: Array<'Admin' | 'Customer'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};