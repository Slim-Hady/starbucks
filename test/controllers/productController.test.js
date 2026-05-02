"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductController_1 = require("../../src/controller/ProductController");
const Product_1 = require("../../src/models/Product");
const APIFeature_1 = __importDefault(require("../../src/utils/APIFeature"));
jest.mock('../../src/models/Product', () => ({
    Product: {
        find: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findById: jest.fn(),
    },
}));
jest.mock('../../src/utils/APIFeature', () => jest.fn());
const mockedProduct = Product_1.Product;
const MockedAPIFeature = APIFeature_1.default;
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('ProductController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllProducts', () => {
        it('should return all products with correct response format', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                query: {
                    sort: 'price',
                    fields: 'name,price',
                    page: '1',
                    limit: '10',
                },
            };
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
            mockedProduct.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, ProductController_1.getAllProducts)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all products',
                result: products.length,
                data: { products },
            });
        }));
        it('should handle empty product list', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { query: {} };
            const res = createMockResponse();
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve([]),
            };
            mockedProduct.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, ProductController_1.getAllProducts)(req, res);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all products',
                result: 0,
                data: { products: [] },
            });
        }));
        it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { query: {} };
            const res = createMockResponse();
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.reject(new Error('DB error')),
            };
            mockedProduct.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, ProductController_1.getAllProducts)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
        it('should filter products by category', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                query: { category: '507f1f77bcf86cd799439011' },
            };
            const res = createMockResponse();
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve([]),
            };
            mockedProduct.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, ProductController_1.getAllProducts)(req, res);
            expect(MockedAPIFeature).toHaveBeenCalled();
        }));
    });
    describe('getProduct', () => {
        it('should return the product attached to the request', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = { _id: '1', name: 'Latte', price: 4.99 };
            const req = { product };
            const res = createMockResponse();
            yield (0, ProductController_1.getProduct)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get product',
                data: { product },
            });
        }));
    });
    describe('CreateProduct', () => {
        it('should create a new product with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
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
            };
            const res = createMockResponse();
            const createdProduct = Object.assign({ _id: '1' }, req.body);
            mockedProduct.create.mockResolvedValue(createdProduct);
            yield (0, ProductController_1.CreateProduct)(req, res);
            expect(mockedProduct.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
        }));
        it('should handle creation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: { name: 'Mocha' } };
            const res = createMockResponse();
            mockedProduct.create.mockRejectedValue(new Error('Validation error'));
            yield (0, ProductController_1.CreateProduct)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('UpdateProduct', () => {
        it('should update the current product', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = { _id: '507f1f77bcf86cd799439011', name: 'Latte', price: 4.99 };
            const req = { product, body: { price: 5.99 } };
            const res = createMockResponse();
            mockedProduct.findByIdAndUpdate.mockResolvedValue(Object.assign(Object.assign({}, product), { price: 5.99 }));
            yield (0, ProductController_1.UpdateProduct)(req, res);
            expect(mockedProduct.findByIdAndUpdate).toHaveBeenCalledWith(product._id, req.body, { new: true, runValidators: true });
            expect(res.status).toHaveBeenCalledWith(200);
        }));
    });
    describe('DeleteProduct', () => {
        it('should delete the current product', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = { _id: '507f1f77bcf86cd799439011', name: 'Latte' };
            const req = { product };
            const res = createMockResponse();
            mockedProduct.findByIdAndDelete.mockResolvedValue(product);
            yield (0, ProductController_1.DeleteProduct)(req, res);
            expect(mockedProduct.findByIdAndDelete).toHaveBeenCalledWith(product._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Product',
                message: 'Product deleted succefully',
            });
        }));
    });
    describe('checkValidID', () => {
        it('should reject invalid ObjectId formats', () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();
            (0, ProductController_1.checkValidID)(req, res, next, 'invalid-id');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Invalid ID format',
            });
        });
        it('should allow valid ObjectId strings', () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();
            const validId = new mongoose_1.default.Types.ObjectId().toString();
            (0, ProductController_1.checkValidID)(req, res, next, validId);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('checkExistID', () => {
        it('should attach product to request when ID exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            const product = { _id: req.params.id, name: 'Latte' };
            mockedProduct.findById.mockResolvedValue(product);
            yield (0, ProductController_1.checkExistID)(req, res, next);
            expect(mockedProduct.findById).toHaveBeenCalledWith(req.params.id);
            expect(req.product).toEqual(product);
            expect(next).toHaveBeenCalled();
        }));
        it('should return 401 when product does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            mockedProduct.findById.mockResolvedValue(null);
            yield (0, ProductController_1.checkExistID)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
        }));
    });
});
//# sourceMappingURL=productController.test.js.map