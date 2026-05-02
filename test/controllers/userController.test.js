"use strict";
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
const UserController_1 = require("../../src/controller/UserController");
const User_1 = require("../../src/models/User");
const APIFeature_1 = __importDefault(require("../../src/utils/APIFeature"));
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
const mockedUser = User_1.User;
const MockedAPIFeature = APIFeature_1.default;
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('UserController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllUsers', () => {
        it('returns users through APIFeature chain', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                query: {
                    sort: 'name',
                    fields: 'name,email',
                    page: '1',
                    limit: '10',
                },
            };
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
            mockedUser.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, UserController_1.getAllUsers)(req, res);
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
        }));
        it('handles empty query parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { query: {} };
            const res = createMockResponse();
            const users = [];
            const queryStub = { find: jest.fn() };
            const featureInstance = {
                filter: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limitFields: jest.fn().mockReturnThis(),
                pagination: jest.fn().mockReturnThis(),
                query: Promise.resolve(users),
            };
            mockedUser.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, UserController_1.getAllUsers)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Sucess get all users',
                result: 0,
                data: { users: [] },
            });
        }));
        it('handles database errors', () => __awaiter(void 0, void 0, void 0, function* () {
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
            mockedUser.find.mockReturnValue(queryStub);
            MockedAPIFeature.mockImplementation(() => featureInstance);
            yield (0, UserController_1.getAllUsers)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Failed',
                message: 'Database error',
            });
        }));
    });
    describe('getUser', () => {
        it('returns the user attached to the request', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = { _id: '1', name: 'John' };
            const req = { user };
            const res = createMockResponse();
            yield (0, UserController_1.getUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success get user',
                data: { user },
            });
        }));
    });
    describe('CreateUser', () => {
        it('creates a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { body: { name: 'John', email: 'john@example.com' } };
            const res = createMockResponse();
            const createdUser = Object.assign({ _id: '1' }, req.body);
            mockedUser.create.mockResolvedValue(createdUser);
            yield (0, UserController_1.CreateUser)(req, res);
            expect(mockedUser.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success create user',
                data: { user: createdUser },
            });
        }));
    });
    describe('UpdateUser', () => {
        it('updates the current user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = { _id: '507f1f77bcf86cd799439011', name: 'John' };
            const req = { user, body: { name: 'Johnny' } };
            const res = createMockResponse();
            mockedUser.findByIdAndUpdate.mockResolvedValue(Object.assign(Object.assign({}, user), { name: 'Johnny' }));
            yield (0, UserController_1.UpdateUser)(req, res);
            expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledWith(user._id, req.body, {
                new: true,
                runValidators: true,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update User',
                data: { user },
            });
        }));
    });
    describe('DeleteUser', () => {
        it('deletes the current user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = { _id: '507f1f77bcf86cd799439011', name: 'John' };
            const req = { user };
            const res = createMockResponse();
            mockedUser.findByIdAndDelete.mockResolvedValue(user);
            yield (0, UserController_1.DeleteUser)(req, res);
            expect(mockedUser.findByIdAndDelete).toHaveBeenCalledWith(user._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'Success Update User',
                message: 'User deleted succefully',
            });
        }));
    });
    describe('checkValidID', () => {
        it('rejects invalid object ids', () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();
            (0, UserController_1.checkValidID)(req, res, next, 'invalid-id');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Invalid ID format',
            });
            expect(next).not.toHaveBeenCalled();
        });
        it('allows valid object ids', () => {
            const req = {};
            const res = createMockResponse();
            const next = jest.fn();
            const validId = new mongoose_1.default.Types.ObjectId().toString();
            (0, UserController_1.checkValidID)(req, res, next, validId);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
    describe('checkExistID', () => {
        it('attaches the user when the id exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            const user = { _id: req.params.id, name: 'John' };
            mockedUser.findById.mockResolvedValue(user);
            yield (0, UserController_1.checkExistID)(req, res, next);
            expect(mockedUser.findById).toHaveBeenCalledWith(req.params.id);
            expect(req.user).toEqual(user);
            expect(next).toHaveBeenCalledTimes(1);
        }));
        it('returns 401 when the id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            const res = createMockResponse();
            const next = jest.fn();
            mockedUser.findById.mockResolvedValue(null);
            yield (0, UserController_1.checkExistID)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'ID not found',
            });
            expect(next).not.toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=userController.test.js.map