import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import APIFeature from '../utils/APIFeature';
import { Category } from '../models/Category';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const features = new APIFeature(Category.find(), req.query as any)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const categories = await features.query;

        res.status(200).json({
            status: 'Sucess get all categories',
            result: categories.length,
            data: { categories },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const getCategory = async (req: Request, res: Response) => {
    try {
        const category = (req as any).category;

        res.status(200).json({
            status: 'Success get category',
            data: { category },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const CreateCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            status: 'Success create category',
            data: { category },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const UpdateCategory = async (req: Request, res: Response) => {
    try {
        const category = (req as any).category;
        await Category.findByIdAndUpdate(category._id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'Success Update Category',
            data: { category },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const DeleteCategory = async (req: Request, res: Response) => {
    try {
        const category = (req as any).category;

        await Category.findByIdAndDelete(category._id);
        res.status(200).json({
            status: 'Success Update Category',
            message: 'Category deleted succefully',
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
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(401).json({
                status: 'fail',
                message: 'ID not found',
            });
        }
        (req as any).category = category;
        next();
    } catch (err: any) {
        res.status(500).json({ status: 'err', message: err.message });
    }
};