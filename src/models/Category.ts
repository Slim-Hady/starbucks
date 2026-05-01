import { Schema, model } from 'mongoose';
import slugify from 'slugify';

export interface ICategory {
    name: string;
    description: string;
    createdAt?: Date;
    slug?: string;
}

const CategorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: [true, 'Category name must be filled'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Category description must be filled'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: String,
});

CategorySchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true });
});

export const Category = model<ICategory>('Category', CategorySchema);