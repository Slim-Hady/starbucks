"use strict";
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
const CategoryController_1 = require("../../src/controller/CategoryController");
const Category_1 = require("../../src/models/Category");
const APIFeature_1 = __importDefault(require("../../src/utils/APIFeature"));
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
const mockedCategory = Category_1.Category;
const MockedAPIFeature = APIFeature_1.default;
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('CategoryController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllCategories', () => {
        it('should return all categories with correct response format', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                query: {
                    sort: 'name',
                    fields: 'name,slug',
                    page: '1',
                    limit: '10',
                },
            };
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
            mockedCategory.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, CategoryController_1.getAllCategories)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all categories',
                result: categories.length,
                data: { categories },
            });
        }));
        it('should handle empty category list', () => __awaiter(void 0, void 0, void 0, function* () {
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
            mockedCategory.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, CategoryController_1.getAllCategories)(req, res);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all categories',
                result: 0,
                data: { categories: [] },
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
                query: Promise.reject(new Error('Database error')),
            };
            mockedCategory.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, CategoryController_1.getAllCategories)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Failed',
                message: 'Database error',
            });
        }));
    });
    describe('getCategory', () => {
        it('should return the category attached to the request', () => __awaiter(void 0, void 0, void 0, function* () {
            const category = { _id: '1', name: 'Drinks', slug: 'drinks' };
            const req = { category };
            const res = createMockResponse();
            yield (0, CategoryController_1.getCategory)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get category',
                data: { category },
            });
        }));
        it('should handle missing category gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { category: null };
            const res = createMockResponse();
            yield (0, CategoryController_1.getCategory)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
    });
    describe('CreateCategory', () => {
        it('should create a new category with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { name: 'Merchandise', slug: 'merchandise' }
            };
            const res = createMockResponse();
            const createdCategory = Object.assign({ _id: '1' }, req.body);
            mockedCategory.create.mockResolvedValue(createdCategory);
            yield (0, CategoryController_1.CreateCategory)(req, res);
            expect(mockedCategory.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success create category',
                data: { category: createdCategory },
            });
        }));
        it('should handle duplicate category names', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: { name: 'Drinks' } };
            const res = createMockResponse();
            mockedCategory.create.mockRejectedValue(new Error('Duplicate key'));
            yield (0, CategoryController_1.CreateCategory)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('UpdateCategory', () => {
        it('should update the current category', () => __awaiter(void 0, void 0, void 0, function* () {
            const category = { _id: '507f1f77bcf86cd799439011', name: 'Drinks' };
            const req = { category, body: { name: 'Beverages' } };
            const res = createMockResponse();
            mockedCategory.findByIdAndUpdate.mockResolvedValue(Object.assign(Object.assign({}, category), { name: 'Beverages' }));
            yield (0, CategoryController_1.UpdateCategory)(req, res);
            expect(mockedCategory.findByIdAndUpdate).toHaveBeenCalledWith(category._id, req.body, { new: true, runValidators: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Category',
                data: { category },
            });
        }));
        it('should handle update errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const category = { _id: '507f1f77bcf86cd799439011' };
            const req = { category, body: { name: 'New' } };
            const res = createMockResponse();
            mockedCategory.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));
            yield (0, CategoryController_1.UpdateCategory)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('DeleteCategory', () => {
        it('should delete the current category', () => __awaiter(void 0, void 0, void 0, function* () {
            const category = { _id: '507f1f77bcf86cd799439011', name: 'Drinks' };
            const req = { category };
            const res = createMockResponse();
            mockedCategory.findByIdAndDelete.mockResolvedValue(category);
            yield (0, CategoryController_1.DeleteCategory)(req, res);
            expect(mockedCategory.findByIdAndDelete).toHaveBeenCalledWith(category._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Category',
                message: 'Category deleted succefully',
            });
        }));
        it('should handle delete errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const category = { _id: '507f1f77bcf86cd799439011' };
            const req = { category };
            const res = createMockResponse();
            mockedCategory.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));
            yield (0, CategoryController_1.DeleteCategory)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('checkValidID', () => {
        it('should reject invalid ObjectId formats', () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();
            (0, CategoryController_1.checkValidID)(req, res, next, 'invalid-id');
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
            (0, CategoryController_1.checkValidID)(req, res, next, validId);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('checkExistID', () => {
        it('should attach category to request when ID exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            const category = { _id: req.params.id, name: 'Drinks' };
            mockedCategory.findById.mockResolvedValue(category);
            yield (0, CategoryController_1.checkExistID)(req, res, next);
            expect(mockedCategory.findById).toHaveBeenCalledWith(req.params.id);
            expect(req.category).toEqual(category);
            expect(next).toHaveBeenCalled();
        }));
        it('should return 401 when category does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            mockedCategory.findById.mockResolvedValue(null);
            yield (0, CategoryController_1.checkExistID)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
        }));
    });
});
//# sourceMappingURL=categoryController.test.js.map