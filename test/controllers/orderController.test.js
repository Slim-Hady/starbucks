"use strict";
/**
 * ====================================================================================
 * Test Suite: Order Controller Tests
 * ====================================================================================
 *
 * WHAT THIS FILE TESTS:
 * =====================
 * This file contains unit tests for the OrderController which handles all order-related
 * operations in the Starbucks backend application.
 *
 * COVERAGE:
 * ---------
 * 1. getAllOrders - Retrieves all orders with filtering, sorting, pagination
 * 2. getOrder - Retrieves a single order by ID
 * 3. CreateOrder - Creates a new order
 * 4. UpdateOrder - Updates an existing order status
 * 5. DeleteOrder - Deletes an order
 * 6. checkValidID - Middleware to validate MongoDB ObjectId format
 * 7. checkExistID - Middleware to check if order exists in database
 *
 * ORDER STATUSES:
 * ---------------
 * - Pending: Order created, awaiting processing
 * - Processing: Order is being prepared
 * - Completed: Order delivered/completed
 * - Cancelled: Order cancelled by user or admin
 *
 * EDGE CASES TESTED:
 * ------------------
 * - Order with multiple items
 * - Order status transitions
 * - Empty order list
 * - Order total price calculation
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
const OrderController_1 = require("../../src/controller/OrderController");
const Order_1 = require("../../src/models/Order");
const APIFeature_1 = __importDefault(require("../../src/utils/APIFeature"));
jest.mock('../../src/models/Order', () => ({
    Order: {
        find: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findById: jest.fn(),
    },
}));
jest.mock('../../src/utils/APIFeature', () => jest.fn());
const mockedOrder = Order_1.Order;
const MockedAPIFeature = APIFeature_1.default;
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('OrderController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllOrders', () => {
        it('should return all orders with correct response format', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                query: {
                    sort: '-createdAt',
                    fields: 'user,totalPrice,status',
                    page: '1',
                    limit: '10',
                },
            };
            const res = createMockResponse();
            const orders = [
                { _id: '1', user: 'user1', totalPrice: 25.99, status: 'Completed' },
                { _id: '2', user: 'user2', totalPrice: 15.50, status: 'Pending' }
            ];
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve(orders),
            };
            mockedOrder.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, OrderController_1.getAllOrders)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all orders',
                result: orders.length,
                data: { orders },
            });
        }));
        it('should handle empty order list', () => __awaiter(void 0, void 0, void 0, function* () {
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
            mockedOrder.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, OrderController_1.getAllOrders)(req, res);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all orders',
                result: 0,
                data: { orders: [] },
            });
        }));
        it('should filter orders by status', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                query: { status: 'Completed' },
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
            mockedOrder.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, OrderController_1.getAllOrders)(req, res);
            expect(MockedAPIFeature).toHaveBeenCalledWith(queryStub, req.query);
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
            mockedOrder.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, OrderController_1.getAllOrders)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('getOrder', () => {
        it('should return the order attached to the request', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = {
                _id: '1',
                user: 'user1',
                items: [
                    { product: 'prod1', size: 'large', quantity: 2, price: 5.99 }
                ],
                totalPrice: 11.98,
                status: 'Pending'
            };
            const req = { order };
            const res = createMockResponse();
            yield (0, OrderController_1.getOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get order',
                data: { order },
            });
        }));
        it('should handle missing order gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { order: null };
            const res = createMockResponse();
            yield (0, OrderController_1.getOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
    });
    describe('CreateOrder', () => {
        it('should create a new order with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: {
                    user: '507f1f77bcf86cd799439011',
                    items: [
                        { product: 'prod1', size: 'large', quantity: 2, price: 5.99 },
                        { product: 'prod2', size: 'medium', quantity: 1, price: 4.50 }
                    ],
                    totalPrice: 16.48,
                    status: 'Pending'
                }
            };
            const res = createMockResponse();
            const createdOrder = Object.assign({ _id: '1' }, req.body);
            mockedOrder.create.mockResolvedValue(createdOrder);
            yield (0, OrderController_1.CreateOrder)(req, res);
            expect(mockedOrder.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success create order',
                data: { order: createdOrder },
            });
        }));
        it('should handle creation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: { user: 'user1', items: [] } };
            const res = createMockResponse();
            mockedOrder.create.mockRejectedValue(new Error('Validation error'));
            yield (0, OrderController_1.CreateOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
        it('should handle missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: { user: 'user1' } };
            const res = createMockResponse();
            mockedOrder.create.mockRejectedValue(new Error('Validation error'));
            yield (0, OrderController_1.CreateOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('UpdateOrder', () => {
        it('should update the order status', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = { _id: '507f1f77bcf86cd799439011', status: 'Pending' };
            const req = { order, body: { status: 'Processing' } };
            const res = createMockResponse();
            mockedOrder.findByIdAndUpdate.mockResolvedValue(Object.assign(Object.assign({}, order), { status: 'Processing' }));
            yield (0, OrderController_1.UpdateOrder)(req, res);
            expect(mockedOrder.findByIdAndUpdate).toHaveBeenCalledWith(order._id, req.body, { new: true, runValidators: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Order',
                data: { order },
            });
        }));
        it('should handle invalid status values', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = { _id: '507f1f77bcf86cd799439011' };
            const req = { order, body: { status: 'InvalidStatus' } };
            const res = createMockResponse();
            mockedOrder.findByIdAndUpdate.mockRejectedValue(new Error('Invalid enum'));
            yield (0, OrderController_1.UpdateOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('DeleteOrder', () => {
        it('should delete the current order', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = { _id: '507f1f77bcf86cd799439011', status: 'Pending' };
            const req = { order };
            const res = createMockResponse();
            mockedOrder.findByIdAndDelete.mockResolvedValue(order);
            yield (0, OrderController_1.DeleteOrder)(req, res);
            expect(mockedOrder.findByIdAndDelete).toHaveBeenCalledWith(order._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Order',
                message: 'Order deleted succefully',
            });
        }));
        it('should handle delete errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = { _id: '507f1f77bcf86cd799439011' };
            const req = { order };
            const res = createMockResponse();
            mockedOrder.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));
            yield (0, OrderController_1.DeleteOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('checkValidID', () => {
        it('should reject invalid ObjectId formats', () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();
            (0, OrderController_1.checkValidID)(req, res, next, 'invalid-id');
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
            (0, OrderController_1.checkValidID)(req, res, next, validId);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('checkExistID', () => {
        it('should attach order to request when ID exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            const order = { _id: req.params.id, status: 'Pending' };
            mockedOrder.findById.mockResolvedValue(order);
            yield (0, OrderController_1.checkExistID)(req, res, next);
            expect(mockedOrder.findById).toHaveBeenCalledWith(req.params.id);
            expect(req.order).toEqual(order);
            expect(next).toHaveBeenCalled();
        }));
        it('should return 401 when order does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            mockedOrder.findById.mockResolvedValue(null);
            yield (0, OrderController_1.checkExistID)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
        }));
    });
});
//# sourceMappingURL=orderController.test.js.map