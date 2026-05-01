import { Schema, model, Types } from 'mongoose';

export interface IOrderItem {
    product: Types.ObjectId;
    size: string;
    quantity: number;
    price: number;
}

export interface IOrder {
    user: Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Order item product must be filled'],
    },
    size: {
        type: String,
        required: [true, 'Order item size must be filled'],
    },
    quantity: {
        type: Number,
        required: [true, 'Order item quantity must be filled'],
        min: 1,
    },
    price: {
        type: Number,
        required: [true, 'Order item price must be filled'],
    },
});

const OrderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order user must be filled'],
    },
    items: {
        type: [OrderItemSchema],
        required: [true, 'Order items must be filled'],
    },
    totalPrice: {
        type: Number,
        required: [true, 'Order total price must be filled'],
    },
    status: {
        type: String,
        enum: {
            values: ['Pending', 'Processing', 'Completed', 'Cancelled'],
            message: 'Status must be one of: Pending, Processing, Completed, Cancelled',
        },
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

OrderSchema.pre('save', function () {
    this.updatedAt = new Date();
});

export const Order = model<IOrder>('Order', OrderSchema);