import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { Product } from '../models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20' as any,
});

export const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    const quantity = Number(req.body.quantity) || 1;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${clientUrl}/success`,
        cancel_url: `${clientUrl}/cancel`,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: product.image ? [product.image] : undefined,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity,
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        session,
    });
});