import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name must be filled'],
        trim: true,
        unique: true,
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

export const Category = model('Category', CategorySchema);