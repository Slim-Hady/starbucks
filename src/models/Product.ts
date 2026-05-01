import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name must be filled'],
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price must be filled'],
    },
    description: {
        type: String,
        required: [true, 'Product description must be filled'],
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Product image must be filled'],
        trim: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category must be filled'],
    },
    sizes: {
        type: [String],
        default: [],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: String,
});

ProductSchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true });
});

export const Product = model('Product', ProductSchema);