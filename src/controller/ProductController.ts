import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import APIFeature from '../utils/APIFeature';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const features = new APIFeature(Product.find(), req.query as any)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const products = await features.query;

        res.status(200).json({
            status: 'Sucess get all products',
            result: products.length,
            data: { products },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = (req as any).product;

        res.status(200).json({
            status: 'Success get product',
            data: { product },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const CreateProduct = async (req: Request, res: Response) => {
    try {
        // Handle category field - accept either ObjectId or category name
        let categoryValue = req.body.category;
        
        // If category is provided as a string that's not a valid ObjectId, 
        // try to find the category by name
        if (categoryValue && typeof categoryValue === 'string' && !mongoose.Types.ObjectId.isValid(categoryValue)) {
            const category = await Category.findOne({ name: categoryValue });
            if (!category) {
                return res.status(400).json({
                    status: 'Failed',
                    message: `Category with name '${categoryValue}' not found`,
                });
            }
            // Replace category name with the actual ObjectId
            req.body.category = category._id;
        }
        
        const product = await Product.create(req.body);

        res.status(201).json({
            status: 'Success create product',
            data: { product },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const UpdateProduct = async (req: Request, res: Response) => {
    try {
        const product = (req as any).product;
        
        // Handle category field - accept either ObjectId or category name
        if (req.body.category) {
            let categoryValue = req.body.category;
            
            // If category is provided as a string that's not a valid ObjectId, 
            // try to find the category by name
            if (typeof categoryValue === 'string' && !mongoose.Types.ObjectId.isValid(categoryValue)) {
                const category = await Category.findOne({ name: categoryValue });
                if (!category) {
                    return res.status(400).json({
                        status: 'Failed',
                        message: `Category with name '${categoryValue}' not found`,
                    });
                }
                // Replace category name with the actual ObjectId
                req.body.category = category._id;
            }
        }
        
        await Product.findByIdAndUpdate(product._id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'Success Update Product',
            data: { product },
        });
    } catch (err: any) {
        res.status(500).json({ status: 'Failed', message: err.message });
    }
};

export const DeleteProduct = async (req: Request, res: Response) => {
    try {
        const product = (req as any).product;

        await Product.findByIdAndDelete(product._id);
        res.status(200).json({
            status: 'Success Update Product',
            message: 'Product deleted succefully',
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
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(401).json({
                status: 'fail',
                message: 'ID not found',
            });
        }
        (req as any).product = product;
        next();
    } catch (err: any) {
        res.status(500).json({ status: 'err', message: err.message });
    }
};