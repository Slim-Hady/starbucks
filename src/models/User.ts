import bcrypt from 'bcryptjs';
import { HydratedDocument, Schema, model } from 'mongoose';

import slugify from 'slugify';
import validator from 'validator';

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'Admin' | 'Customer';
    createdAt?: Date;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    slug?: string;
}

export interface IUserMethods {
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
}

const UserSchema = new Schema<IUser, any, IUserMethods>({
    name: {
        type: String,
        required: [true, 'User name must be filled'],
        trim: true,
        validate: {
            validator: function (value: string) {
                return /^[a-zA-Z0-9_]+$/.test(value);
            },
            message: (props) => `${props.value} is not a valid username. Use only letters, numbers, and underscores.`,
        },
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'User Email must be filled'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'User Email must be on email format'],
    },
    password: {
        type: String,
        required: [true, 'user password must be filled'],
        trim: true,
        minLength: 8,
        validate: [validator.isStrongPassword, 'User password must be strong'],
        select: false,
    },
    role: {
        type: String,
        enum: {
            values: ['Admin', 'Customer'],
            message: 'Role is either: Admin or Customer',
        },
        default: 'Customer',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    passwordChangedAt: {
        type: Date,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    slug: String,
});

UserSchema.pre('save', async function (this: HydratedDocument<IUser>) {
    if (this.isModified('password')) {
        if (!this.isNew) {
            this.set('passwordChangedAt', new Date(Date.now() - 1000));
        }
        this.password = await bcrypt.hash(this.password, 12);
    }
    this.slug = slugify(this.name, { lower: true });
});

UserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

export const User = model<IUser>('User', UserSchema);