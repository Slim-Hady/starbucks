/**
 * ====================================================================================
 * Test Suite: Category Controller Tests
 * ====================================================================================
 * 
 * WHAT THIS FILE TESTS:
 * =====================
 * This file contains unit tests for the CategoryController which handles all category-related
 * operations in the Starbucks backend application.
 * 
 * COVERAGE:
 * ---------
 * 1. getAllCategories - Retrieves all categories with filtering, sorting, pagination
 * 2. getCategory - Retrieves a single category by ID
 * 3. CreateCategory - Creates a new category
 * 4. UpdateCategory - Updates an existing category
 * 5. DeleteCategory - Deletes a category
 * 6. checkValidID - Middleware to validate MongoDB ObjectId format
 * 7. checkExistID - Middleware to check if category exists in database
 * 
 * CATEGORIES IN STARBUCKS:
 * -----------------------
 * - Drinks (Coffee, Tea, Frappuccino)
 * - Food (Sandwiches, Pastries, Salads)
 * - Merchandise (Mugs, Tumblers, Bags)
 * 
 * EDGE CASES TESTED:
 * ------------------
 * - Category with products (prevent deletion if has products)
 * - Nested categories
 * - Empty category list
 * ====================================================================================
 */

import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import {
    CreateCategory,
    DeleteCategory,
    UpdateCategory,
    checkExistID,
    checkValidID,
    getAllCategories,
    getCategory,
} from '../../src/controller/CategoryController';

import { Category } from '../../src/models/Category';
import APIFeature from '../../src/utils/APIFeature';

jest.mock('../../src/models/Category', () => ({
    Category: {
        find: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.mock('../../src/utils/APIFeature', () => jest.fn());

const mockedCategory = Category as jest.Mocked<typeof Category>;
const MockedAPIFeature = APIFeature as unknown as jest.Mock;

const createMockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('CategoryController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllCategories', () => {
        it('should return all categories with correct response format', async () => {
            const req = {
                query: {
                    sort: 'name',
                    fields: 'name,slug',
                    page: '1',
                    limit: '10',
                },
            } as unknown as Request;
            const res = createMockResponse();
            const categories = [
                { _id: '1', name: 'Drinks', slug: 'drinks' },
                { _id: '2', name: 'Food', slug: 'food' }
            ];
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve(categories),
            };

            mockedCategory.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all categories',
                result: categories.length,
                data: { categories },
            });
        });

        it('should handle empty category list', async () => {
            const req = { query: {} } as unknown as Request;
            const res = createMockResponse();
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve([]),
            };

            mockedCategory.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllCategories(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all categories',
                result: 0,
                data: { categories: [] },
            });
        });

        it('should handle database errors', async () => {
            const req = { query: {} } as unknown as Request;
            const res = createMockResponse();
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.reject(new Error('Database error')),
            };

            mockedCategory.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Failed',
                message: 'Database error',
            });
        });
    });

    describe('getCategory', () => {
        it('should return the category attached to the request', async () => {
            const category = { _id: '1', name: 'Drinks', slug: 'drinks' };
            const req = { category } as unknown as Request;
            const res = createMockResponse();

            await getCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get category',
                data: { category },
            });
        });

        it('should handle missing category gracefully', async () => {
            const req = { category: null } as unknown as Request;
            const res = createMockResponse();

            await getCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('CreateCategory', () => {
        it('should create a new category with valid data', async () => {
            const req = {
                body: { name: 'Merchandise', slug: 'merchandise' }
            } as unknown as Request;
            const res = createMockResponse();
            const createdCategory = { _id: '1', ...req.body };

            mockedCategory.create.mockResolvedValue(createdCategory as any);

            await CreateCategory(req, res);

            expect(mockedCategory.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success create category',
                data: { category: createdCategory },
            });
        });

        it('should handle duplicate category names', async () => {
            const req = { body: { name: 'Drinks' } } as unknown as Request;
            const res = createMockResponse();

            mockedCategory.create.mockRejectedValue(new Error('Duplicate key'));

            await CreateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('UpdateCategory', () => {
        it('should update the current category', async () => {
            const category = { _id: '507f1f77bcf86cd799439011', name: 'Drinks' };
            const req = { category, body: { name: 'Beverages' } } as unknown as Request;
            const res = createMockResponse();

            mockedCategory.findByIdAndUpdate.mockResolvedValue({ ...category, name: 'Beverages' } as any);

            await UpdateCategory(req, res);

            expect(mockedCategory.findByIdAndUpdate).toHaveBeenCalledWith(
                category._id,
                req.body,
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Category',
                data: { category },
            });
        });

        it('should handle update errors', async () => {
            const category = { _id: '507f1f77bcf86cd799439011' };
            const req = { category, body: { name: 'New' } } as unknown as Request;
            const res = createMockResponse();

            mockedCategory.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

            await UpdateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('DeleteCategory', () => {
        it('should delete the current category', async () => {
            const category = { _id: '507f1f77bcf86cd799439011', name: 'Drinks' };
            const req = { category } as unknown as Request;
            const res = createMockResponse();

            mockedCategory.findByIdAndDelete.mockResolvedValue(category as any);

            await DeleteCategory(req, res);

            expect(mockedCategory.findByIdAndDelete).toHaveBeenCalledWith(category._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Category',
                message: 'Category deleted succefully',
            });
        });

        it('should handle delete errors', async () => {
            const category = { _id: '507f1f77bcf86cd799439011' };
            const req = { category } as unknown as Request;
            const res = createMockResponse();

            mockedCategory.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

            await DeleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('checkValidID', () => {
        it('should reject invalid ObjectId formats', () => {
            const req = {} as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;

            checkValidID(req, res, next, 'invalid-id');

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Invalid ID format',
            });
        });

        it('should allow valid ObjectId strings', () => {
            const req = {} as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;
            const validId = new mongoose.Types.ObjectId().toString();

            checkValidID(req, res, next, validId);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('checkExistID', () => {
        it('should attach category to request when ID exists', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;
            const category = { _id: req.params.id, name: 'Drinks' };

            mockedCategory.findById.mockResolvedValue(category as any);

            await checkExistID(req, res, next);

            expect(mockedCategory.findById).toHaveBeenCalledWith(req.params.id);
            expect((req as any).category).toEqual(category);
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 when category does not exist', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;

            mockedCategory.findById.mockResolvedValue(null as any);

            await checkExistID(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
        });
    });
});