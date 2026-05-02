/**
 * ====================================================================================
 * Test Suite: User Controller Tests
 * ====================================================================================
 * 
 * WHAT THIS FILE TESTS:
 * =====================
 * This file contains unit tests for the UserController which handles all user-related
 * operations in the Starbucks backend application.
 * 
 * COVERAGE:
 * ---------
 * 1. getAllUsers - Retrieves all users with filtering, sorting, pagination
 * 2. getUser - Retrieves a single user by ID
 * 3. CreateUser - Creates a new user
 * 4. UpdateUser - Updates an existing user
 * 5. DeleteUser - Deletes a user
 * 6. checkValidID - Middleware to validate MongoDB ObjectId format
 * 7. checkExistID - Middleware to check if user exists in database
 * 
 * EDGE CASES TESTED:
 * ------------------
 * - Invalid ID format handling
 * - Non-existent user ID
 * - Empty query parameters
 * - Pagination with various page/limit values
 * - Database errors
 * ====================================================================================
 */

import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import {
    CreateUser,
    DeleteUser,
    UpdateUser,
    checkExistID,
    checkValidID,
    getAllUsers,
    getUser,
} from '../../src/controller/UserController';

import { User } from '../../src/models/User';
import APIFeature from '../../src/utils/APIFeature';

jest.mock('../../src/models/User', () => ({
    User: {
        find: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.mock('../../src/utils/APIFeature', () => {
    return jest.fn().mockImplementation(() => ({
        filter: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limitFields: jest.fn().mockReturnThis(),
        pagination: jest.fn().mockReturnThis(),
        query: Promise.resolve([]),
    }));
});

const mockedUser = User as jest.Mocked<typeof User>;
const MockedAPIFeature = APIFeature as unknown as jest.Mock;

const createMockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('returns users through APIFeature chain', async () => {
            const req = {
                query: {
                    sort: 'name',
                    fields: 'name,email',
                    page: '1',
                    limit: '10',
                },
            } as unknown as Request;
            const res = createMockResponse();
            const users = [{ _id: '1', name: 'John' }];
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve(users),
            };

            mockedUser.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllUsers(req, res);

            expect(mockedUser.find).toHaveBeenCalledTimes(1);
            expect(MockedAPIFeature).toHaveBeenCalledWith(queryStub, req.query);
            expect(featureInstance.filter).toHaveBeenCalledTimes(1);
            expect(featureInstance.sort).toHaveBeenCalledTimes(1);
            expect(featureInstance.limitFields).toHaveBeenCalledTimes(1);
            expect(featureInstance.pagination).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all users',
                result: users.length,
                data: { users },
            });
        });

        it('handles empty query parameters', async () => {
            const req = { query: {} } as unknown as Request;
            const res = createMockResponse();
            const users: any[] = [];
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve(users),
            };

            mockedUser.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all users',
                result: 0,
                data: { users: [] },
            });
        });

        it('handles database errors', async () => {
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

            mockedUser.find.mockReturnValue(queryStub as any);
            MockedAPIFeature.mockImplementation(() => featureInstance);

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Failed',
                message: 'Database error',
            });
        });
    });

    describe('getUser', () => {
        it('returns the user attached to the request', async () => {
            const user = { _id: '1', name: 'John' };
            const req = { user } as unknown as Request;
            const res = createMockResponse();

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get user',
                data: { user },
            });
        });
    });

    describe('CreateUser', () => {
        it('creates a new user', async () => {
            const req = { body: { name: 'John', email: 'john@example.com' } } as unknown as Request;
            const res = createMockResponse();
            const createdUser = { _id: '1', ...req.body };

            mockedUser.create.mockResolvedValue(createdUser as any);

            await CreateUser(req, res);

            expect(mockedUser.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success create user',
                data: { user: createdUser },
            });
        });
    });

    describe('UpdateUser', () => {
        it('updates the current user', async () => {
            const user = { _id: '507f1f77bcf86cd799439011', name: 'John' };
            const req = { user, body: { name: 'Johnny' } } as unknown as Request;
            const res = createMockResponse();

            mockedUser.findByIdAndUpdate.mockResolvedValue({ ...user, name: 'Johnny' } as any);

            await UpdateUser(req, res);

            expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledWith(user._id, req.body, {
                new: true,
                runValidators: true,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update User',
                data: { user },
            });
        });
    });

    describe('DeleteUser', () => {
        it('deletes the current user', async () => {
            const user = { _id: '507f1f77bcf86cd799439011', name: 'John' };
            const req = { user } as unknown as Request;
            const res = createMockResponse();

            mockedUser.findByIdAndDelete.mockResolvedValue(user as any);

            await DeleteUser(req, res);

            expect(mockedUser.findByIdAndDelete).toHaveBeenCalledWith(user._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update User',
                message: 'User deleted succefully',
            });
        });
    });

    describe('checkValidID', () => {
        it('rejects invalid object ids', () => {
            const req = {} as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;

            checkValidID(req, res, next, 'invalid-id');

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Invalid ID format',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('allows valid object ids', () => {
            const req = {} as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;
            const validId = new mongoose.Types.ObjectId().toString();

            checkValidID(req, res, next, validId);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('checkExistID', () => {
        it('attaches the user when the id exists', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;
            const user = { _id: req.params.id, name: 'John' };

            mockedUser.findById.mockResolvedValue(user as any);

            await checkExistID(req, res, next);

            expect(mockedUser.findById).toHaveBeenCalledWith(req.params.id);
            expect((req as any).user).toEqual(user);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('returns 401 when the id does not exist', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn() as NextFunction;

            mockedUser.findById.mockResolvedValue(null as any);

            await checkExistID(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});