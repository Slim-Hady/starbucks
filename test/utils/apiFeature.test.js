"use strict";
/**
 * ====================================================================================
 * Test Suite: APIFeature Utility Tests
 * ====================================================================================
 * Tests the APIFeature utility class for filtering, sorting, field selection, pagination.
 * ====================================================================================
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIFeature_1 = __importDefault(require("../../src/utils/APIFeature"));
describe('APIFeature', () => {
    const createMockQuery = () => ({
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('filter', () => {
        it('should exclude pagination and sorting params', () => {
            const mockQuery = createMockQuery();
            const queryString = {
                page: '1',
                limit: '10',
                sort: 'name',
                fields: 'name,email',
                price: '10',
            };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.filter();
            expect(mockQuery.find).toHaveBeenCalledWith({ price: '10' });
        });
        it('should handle empty query string', () => {
            const mockQuery = createMockQuery();
            const queryString = {};
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.filter();
            expect(mockQuery.find).toHaveBeenCalledWith({});
        });
        it('should handle gt/gte/lt/lte operators', () => {
            const mockQuery = createMockQuery();
            const queryString = { price_gt: '10', quantity_gte: '5' };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.filter();
            const calledWith = mockQuery.find.mock.calls[0][0];
            expect(calledWith.price_gt).toBe('10');
            expect(calledWith.quantity_gte).toBe('5');
        });
    });
    describe('sort', () => {
        it('should sort by specified field', () => {
            const mockQuery = createMockQuery();
            const queryString = { sort: 'price' };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.sort();
            expect(mockQuery.sort).toHaveBeenCalledWith('price');
        });
        it('should sort by multiple fields', () => {
            const mockQuery = createMockQuery();
            const queryString = { sort: 'price,name' };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.sort();
            expect(mockQuery.sort).toHaveBeenCalledWith('price name');
        });
        it('should default to createdAt descending', () => {
            const mockQuery = createMockQuery();
            const queryString = {};
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.sort();
            expect(mockQuery.sort).toHaveBeenCalledWith('-createdAt');
        });
    });
    describe('limitFields', () => {
        it('should select specific fields', () => {
            const mockQuery = createMockQuery();
            const queryString = { fields: 'name,email,price' };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.limitFields();
            expect(mockQuery.select).toHaveBeenCalledWith('name email price');
        });
        it('should exclude __v field by default', () => {
            const mockQuery = createMockQuery();
            const queryString = {};
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.limitFields();
            expect(mockQuery.select).toHaveBeenCalledWith('-__v');
        });
    });
    describe('pagination', () => {
        it('should apply default pagination', () => {
            const mockQuery = createMockQuery();
            const queryString = {};
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.pagination();
            expect(mockQuery.skip).toHaveBeenCalledWith(0);
            expect(mockQuery.limit).toHaveBeenCalledWith(10);
        });
        it('should calculate correct skip for page 2', () => {
            const mockQuery = createMockQuery();
            const queryString = { page: '2', limit: '10' };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.pagination();
            expect(mockQuery.skip).toHaveBeenCalledWith(10);
        });
        it('should handle custom limit', () => {
            const mockQuery = createMockQuery();
            const queryString = { page: '1', limit: '25' };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.pagination();
            expect(mockQuery.limit).toHaveBeenCalledWith(25);
        });
    });
    describe('Chaining', () => {
        it('should allow method chaining', () => {
            const mockQuery = createMockQuery();
            const queryString = {
                price: '10',
                sort: 'name',
                fields: 'name',
                page: '1',
            };
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            const result = apiFeature.filter().sort().limitFields().pagination();
            expect(result).toBeInstanceOf(APIFeature_1.default);
        });
    });
    describe('Performance', () => {
        it('should complete filter quickly', () => {
            const mockQuery = createMockQuery();
            const queryString = { price: '10' };
            const start = performance.now();
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.filter();
            const time = performance.now() - start;
            expect(time).toBeLessThan(50);
        });
        it('should complete pagination quickly', () => {
            const mockQuery = createMockQuery();
            const queryString = { page: '100', limit: '50' };
            const start = performance.now();
            const apiFeature = new APIFeature_1.default(mockQuery, queryString);
            apiFeature.pagination();
            const time = performance.now() - start;
            expect(time).toBeLessThan(50);
        });
    });
});
//# sourceMappingURL=apiFeature.test.js.map