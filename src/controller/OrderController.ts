import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import APIFeature from '../utils/APIFeature';
import { Order } from '../models/Order';

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const features = new APIFeature(Order.find(), req.query as any)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const orders = await features.query;

        res.status(200).json({
            status: 'Sucess get all orders',
            result: orders.length,
            data: { orders },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const order = (req as any).order;

        res.status(200).json({
            status: 'Success get order',
            data: { order },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const CreateOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.create(req.body);

        res.status(201).json({
            status: 'Success create order',
            data: { order },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const UpdateOrder = async (req: Request, res: Response) => {
    try {
        const order = (req as any).order;
        await Order.findByIdAndUpdate(order._id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'Success Update Order',
            data: { order },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const DeleteOrder = async (req: Request, res: Response) => {
    try {
        const order = (req as any).order;

        await Order.findByIdAndDelete(order._id);
        res.status(200).json({
            status: 'Success Update Order',
            message: 'Order deleted succefully',
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const checkValidID = (req: Request, res: Response, next: NextFunction, val: string) => {
    if (!mongoose.Types.ObjectId.isValid(val)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid ID format',
        });
    }
    next();
};

export const checkExistID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(401).json({
                status: 'fail',
                message: 'ID not found',
            });
        }
        (req as any).order = order;
        next();
    } catch (err: any) {
        res.status(500).json({ status: 'err', message: err.message });
    }
};