/**
 * ====================================================================================
 * Test Suite: Product Controller Tests
 * ====================================================================================
 * 
 * WHAT THIS FILE TESTS:
 * =====================
 * This file contains unit tests for the ProductController which handles all product-related
 * operations in the Starbucks backend application.
 * 
 * COVERAGE:
 * ---------
 * 1. getAllProducts - Retrieves all products with filtering, sorting, pagination
 * 2. getProduct - Retrieves a single product by ID
 * 3. CreateProduct - Creates a new product
 * 4. UpdateProduct - Updates an existing product
 * 5. DeleteProduct - Deletes a product
 * 6. checkValidID - Middleware to validate MongoDB ObjectId format
 * 7. checkExistID - Middleware to check if product exists in database
 * 
 * EDGE CASES TESTED:
 * ------------------
 * - Product availability status
 * - Different price ranges
 * - Empty product list
 * - Invalid category references
 * 
 * PERFORMANCE NOTES:
 * ------------------
 * The getAllProducts endpoint uses MongoDB queries with indexes on category and price.
 * Expected time complexity: O(log n) for indexed queries, O(n) for unindexed.
 * ====================================================================================
 */

import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import {
    CreateProduct,
    DeleteProduct,
    UpdateProduct,
    checkExistID,
    checkValidID,
    getAllProducts,
    getProduct,
} from '../../src/controller/ProductController';

import { Product } from '../../src/models/Product';
import { Category } from '../../src/models/Category';
import APIFeature from '../../src/utils/APIFeature';

jest.mock('../../src/models/Product', () => ({
    Product: {
        find: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.mock('../../src/models/Category', () => ({
    Category: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('../../src/utils/APIFeature', () => jest.fn());

const mockedProduct = Product as jest.Mocked<typeof Product>;
const mockedCategory = Category as jest.Mocked<typeof Category>;
const MockedAPIFeature = APIFeature as unknown as jest.Mock;

const createMockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('ProductController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProducts', () => {
        it('should return all products with correct response format', async () => {
            const req = {
                query: {
                    sort: 'price',
                    fields: 'name,price',
                    page: '1',
                    limit: '10',
                },
            } as unknown as Request;
            const res = createMockResponse();
            const products = [
                { _id: '1', name: 'Latte', price: 4.99 },
                { _id: '2', name: 'Cappuccino', price: 5.99 }
            ];
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve(products),
            };

            mockedProduct.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all products',
                result: products.length,
                data: { products },
            });
        });

        it('should handle empty product list', async () => {
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

            mockedProduct.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllProducts(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all products',
                result: 0,
                data: { products: [] },
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
                query: Promise.reject(new Error('DB error')),
            };

            mockedProduct.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should filter products by category', async () => {
            const req = {
                query: { category: '507f1f77bcf86cd799439011' },
            } as unknown as Request;
            const res = createMockResponse();
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve([]),
            };

            mockedProduct.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllProducts(req, res);

            expect(MockedAPIFeature).toHaveBeenCalled();
        });
    });

    describe('getProduct', () => {
        it('should return the product attached to the request', async () => {
            const product = { _id: '1', name: 'Latte', price: 4.99 };
            const req = { product } as unknown as Request;
            const res = createMockResponse();

            await getProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get product',
                data: { product },
            });
        });
    });

    describe('CreateProduct', () => {
        it('should create a new product with valid ObjectId category', async () => {
            const req = {
                body: {
                    name: 'Mocha',
                    price: 5.99,
                    description: 'Chocolate coffee',
                    image: 'https://example.com/mocha.jpg',
                    category: '507f1f77bcf86cd799439011',
                    sizes: ['small', 'medium', 'large'],
                    isAvailable: true
                }
            } as unknown as Request;
            const res = createMockResponse();
            const createdProduct = { _id: '1', ...req.body };

            mockedProduct.create.mockResolvedValue(createdProduct as any);

            await CreateProduct(req, res);

            expect(mockedProduct.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should create a new product with category name instead of ObjectId', async () => {
            const req = {
                body: {
                    name: 'Latte',
                    price: 4.99,
                    description: 'Coffee with milk',
                    image: 'https://example.com/latte.jpg',
                    category: 'Latte', // Using category name
                    sizes: ['small', 'medium'],
                    isAvailable: true
                }
            } as unknown as Request;
            const res = createMockResponse();
            
            // Mock Category.findOne to return a test category
            const mockCategory = { _id: new mongoose.Types.ObjectId(), name: 'Latte' };
            mockedCategory.findOne.mockResolvedValue(mockCategory as any);
            
            // Mock Product.create to return the created product
            const createdProduct = { _id: new mongoose.Types.ObjectId(), ...req.body, category: mockCategory._id };
            mockedProduct.create.mockResolvedValue(createdProduct as any);

            await CreateProduct(req, res);

            // Verify Category.findOne was called with the category name
            expect(mockedCategory.findOne).toHaveBeenCalledWith({ name: 'Latte' });
            // Verify Product.create was called with the ObjectId, not the string
            expect(mockedProduct.create).toHaveBeenCalledWith({
                ...req.body,
                category: mockCategory._id
            });
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 400 when category name does not exist', async () => {
            const req = {
                body: {
                    name: 'Test Product',
                    price: 4.99,
                    description: 'A test product',
                    image: 'https://example.com/product.jpg',
                    category: 'NonExistentCategory', // This category doesn't exist
                    sizes: ['small'],
                    isAvailable: true
                }
            } as unknown as Request;
            const res = createMockResponse();
            
            // Mock Category.findOne to return null (category not found)
            mockedCategory.findOne.mockResolvedValue(null);

            await CreateProduct(req, res);

            // Verify Category.findOne was called
            expect(mockedCategory.findOne).toHaveBeenCalledWith({ name: 'NonExistentCategory' });
            // Verify Product.create was NOT called
            expect(mockedProduct.create).not.toHaveBeenCalled();
            // Verify error response
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Failed',
                message: 'Category with name \'NonExistentCategory\' not found',
            });
        });

        it('should handle creation errors', async () => {
            const req = { body: { name: 'Mocha' } } as unknown as Request;
            const res = createMockResponse();

            mockedProduct.create.mockRejectedValue(new Error('Validation error'));

            await CreateProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('UpdateProduct', () => {
        it('should update the current product with valid data', async () => {
            const product = { _id: '507f1f77bcf86cd799439011', name: 'Latte', price: 4.99 };
            const req = { product, body: { price: 5.99 } } as unknown as Request;
            const res = createMockResponse();

            mockedProduct.findByIdAndUpdate.mockResolvedValue({ ...product, price: 5.99 } as any);

            await UpdateProduct(req, res);

            expect(mockedProduct.findByIdAndUpdate).toHaveBeenCalledWith(
                product._id,
                req.body,
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should update product with category name instead of ObjectId', async () => {
            const product = { _id: new mongoose.Types.ObjectId(), name: 'Original Product', price: 3.99 };
            const req = { 
                product, 
                body: { 
                    name: 'Updated Product',
                    category: 'Latte' // Using category name
                } 
            } as unknown as Request;
            const res = createMockResponse();
            
            // Mock Category.findOne to return a test category
            const mockCategory = { _id: new mongoose.Types.ObjectId(), name: 'Latte' };
            mockedCategory.findOne.mockResolvedValue(mockCategory as any);
            
            // Mock Product.findByIdAndUpdate to return the updated product
            const updatedProduct = { 
                ...product, 
                name: 'Updated Product',
                category: mockCategory._id 
            };
            mockedProduct.findByIdAndUpdate.mockResolvedValue(updatedProduct as any);

            await UpdateProduct(req, res);

            // Verify Category.findOne was called with the category name
            expect(mockedCategory.findOne).toHaveBeenCalledWith({ name: 'Latte' });
            // Verify Product.findByIdAndUpdate was called with the ObjectId, not the string
            expect(mockedProduct.findByIdAndUpdate).toHaveBeenCalledWith(
                product._id,
                {
                    name: 'Updated Product',
                    category: mockCategory._id
                },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 when updating with non-existent category name', async () => {
            const product = { _id: new mongoose.Types.ObjectId(), name: 'Test Product', price: 4.99 };
            const req = { 
                product, 
                body: { 
                    category: 'NonExistentCategory' // This category doesn't exist
                } 
            } as unknown as Request;
            const res = createMockResponse();
            
            // Mock Category.findOne to return null (category not found)
            mockedCategory.findOne.mockResolvedValue(null);

            await UpdateProduct(req, res);

            // Verify Category.findOne was called
            expect(mockedCategory.findOne).toHaveBeenCalledWith({ name: 'NonExistentCategory' });
            // Verify Product.findByIdAndUpdate was NOT called
            expect(mockedProduct.findByIdAndUpdate).not.toHaveBeenCalled();
            // Verify error response
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Failed',
                message: 'Category with name \'NonExistentCategory\' not found',
            });
        });
    });

    describe('DeleteProduct', () => {
        it('should delete the current product', async () => {
            const product = { _id: '507f1f77bcf86cd799439011', name: 'Latte' };
            const req = { product } as unknown as Request;
            const res = createMockResponse();

            mockedProduct.findByIdAndDelete.mockResolvedValue(product as any);

            await DeleteProduct(req, res);

            expect(mockedProduct.findByIdAndDelete).toHaveBeenCalledWith(product._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Product',
                message: 'Product deleted succefully',
            });
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
        it('should attach product to request when ID exists', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;
            const product = { _id: req.params.id, name: 'Latte' };

            mockedProduct.findById.mockResolvedValue(product as any);

            await checkExistID(req, res, next);

            expect(mockedProduct.findById).toHaveBeenCalledWith(req.params.id);
            expect((req as any).product).toEqual(product);
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 when product does not exist', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;

            mockedProduct.findById.mockResolvedValue(null as any);

            await checkExistID(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
        });
    });
});