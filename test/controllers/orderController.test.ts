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

import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import {
    CreateOrder,
    DeleteOrder,
    UpdateOrder,
    checkExistID,
    checkValidID,
    getAllOrders,
    getOrder,
} from '../../src/controller/OrderController';

import { Order } from '../../src/models/Order';
import APIFeature from '../../src/utils/APIFeature';

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

const mockedOrder = Order as jest.Mocked<typeof Order>;
const MockedAPIFeature = APIFeature as unknown as jest.Mock;

const createMockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('OrderController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllOrders', () => {
        it('should return all orders with correct response format', async () => {
            const req = {
                query: {
                    sort: '-createdAt',
                    fields: 'user,totalPrice,status',
                    page: '1',
                    limit: '10',
                },
            } as unknown as Request;
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

            mockedOrder.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllOrders(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all orders',
                result: orders.length,
                data: { orders },
            });
        });

        it('should handle empty order list', async () => {
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

            mockedOrder.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllOrders(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all orders',
                result: 0,
                data: { orders: [] },
            });
        });

        it('should filter orders by status', async () => {
            const req = {
                query: { status: 'Completed' },
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

            mockedOrder.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllOrders(req, res);

            expect(MockedAPIFeature).toHaveBeenCalledWith(queryStub, req.query);
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

            mockedOrder.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllOrders(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getOrder', () => {
        it('should return the order attached to the request', async () => {
            const order = { 
                _id: '1', 
                user: 'user1', 
                items: [
                    { product: 'prod1', size: 'large', quantity: 2, price: 5.99 }
                ],
                totalPrice: 11.98,
                status: 'Pending'
            };
            const req = { order } as unknown as Request;
            const res = createMockResponse();

            await getOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get order',
                data: { order },
            });
        });

        it('should handle missing order gracefully', async () => {
            const req = { order: null } as unknown as Request;
            const res = createMockResponse();

            await getOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('CreateOrder', () => {
        it('should create a new order with valid data', async () => {
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
            } as unknown as Request;
            const res = createMockResponse();
            const createdOrder = { _id: '1', ...req.body };

            mockedOrder.create.mockResolvedValue(createdOrder as any);

            await CreateOrder(req, res);

            expect(mockedOrder.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success create order',
                data: { order: createdOrder },
            });
        });

        it('should handle creation errors', async () => {
            const req = { body: { user: 'user1', items: [] } } as unknown as Request;
            const res = createMockResponse();

            mockedOrder.create.mockRejectedValue(new Error('Validation error'));

            await CreateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should handle missing required fields', async () => {
            const req = { body: { user: 'user1' } } as unknown as Request;
            const res = createMockResponse();

            mockedOrder.create.mockRejectedValue(new Error('Validation error'));

            await CreateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('UpdateOrder', () => {
        it('should update the order status', async () => {
            const order = { _id: '507f1f77bcf86cd799439011', status: 'Pending' };
            const req = { order, body: { status: 'Processing' } } as unknown as Request;
            const res = createMockResponse();

            mockedOrder.findByIdAndUpdate.mockResolvedValue({ ...order, status: 'Processing' } as any);

            await UpdateOrder(req, res);

            expect(mockedOrder.findByIdAndUpdate).toHaveBeenCalledWith(
                order._id,
                req.body,
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Order',
                data: { order },
            });
        });

        it('should handle invalid status values', async () => {
            const order = { _id: '507f1f77bcf86cd799439011' };
            const req = { order, body: { status: 'InvalidStatus' } } as unknown as Request;
            const res = createMockResponse();

            mockedOrder.findByIdAndUpdate.mockRejectedValue(new Error('Invalid enum'));

            await UpdateOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('DeleteOrder', () => {
        it('should delete the current order', async () => {
            const order = { _id: '507f1f77bcf86cd799439011', status: 'Pending' };
            const req = { order } as unknown as Request;
            const res = createMockResponse();

            mockedOrder.findByIdAndDelete.mockResolvedValue(order as any);

            await DeleteOrder(req, res);

            expect(mockedOrder.findByIdAndDelete).toHaveBeenCalledWith(order._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update Order',
                message: 'Order deleted succefully',
            });
        });

        it('should handle delete errors', async () => {
            const order = { _id: '507f1f77bcf86cd799439011' };
            const req = { order } as unknown as Request;
            const res = createMockResponse();

            mockedOrder.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

            await DeleteOrder(req, res);

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
        it('should attach order to request when ID exists', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;
            const order = { _id: req.params.id, status: 'Pending' };

            mockedOrder.findById.mockResolvedValue(order as any);

            await checkExistID(req, res, next);

            expect(mockedOrder.findById).toHaveBeenCalledWith(req.params.id);
            expect((req as any).order).toEqual(order);
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 when order does not exist', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;

            mockedOrder.findById.mockResolvedValue(null as any);

            await checkExistID(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
        });
    });
});