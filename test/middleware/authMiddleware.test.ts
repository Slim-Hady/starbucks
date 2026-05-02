/**
 * ====================================================================================
 * Test Suite: Auth Middleware Tests
 * ====================================================================================
 * Tests authentication middleware that protects routes and enforces authorization.
 * ====================================================================================
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { protect, restrictTo } from '../../src/middleware/authMiddleware';

jest.mock('../../src/models/User', () => ({
    User: {
        findById: jest.fn(),
    },
}));

import { User } from '../../src/models/User';
const mockedUser = User as jest.Mocked<typeof User>;

const createMockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('AuthMiddleware', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = process.env;
        process.env = { ...originalEnv, JWT_SECRET: 'test-secret-key' };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('protect', () => {
        it('should attach user with valid token from header', async () => {
            const token = jwt.sign({ id: 'user123', iat: Date.now() }, 'test-secret-key');
            const req = {
                headers: { authorization: `Bearer ${token}` },
                cookies: {},
            } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn();

            mockedUser.findById.mockResolvedValue({
                _id: 'user123',
                changedPasswordAfter: jest.fn().mockReturnValue(false),
            } as any);

            await protect(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should reject request without token', async () => {
            const req = { headers: {}, cookies: {} } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn();

            await protect(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ statusCode: 401 })
            );
        });

        it('should reject with invalid token', async () => {
            const req = {
                headers: { authorization: 'Bearer invalid-token' },
                cookies: {},
            } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn();

            await protect(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ statusCode: 401 })
            );
        });

        it('should reject if user no longer exists', async () => {
            const token = jwt.sign({ id: 'nonexistent', iat: Date.now() }, 'test-secret-key');
            const req = {
                headers: { authorization: `Bearer ${token}` },
                cookies: {},
            } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn();

            mockedUser.findById.mockResolvedValue(null);

            await protect(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ statusCode: 401 })
            );
        });
    });

    describe('restrictTo', () => {
        it('should allow access for authorized role', () => {
            const middleware = restrictTo('Admin');
            const req = { user: { role: 'Admin' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should deny access for unauthorized role', () => {
            const middleware = restrictTo('Admin');
            const req = { user: { role: 'Customer' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn();

            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ statusCode: 403 })
            );
        });

        it('should allow access for multiple roles', () => {
            const middleware = restrictTo('Admin', 'Customer');
            const req = { user: { role: 'Customer' } } as unknown as Request;
            const res = createMockResponse();
            const next = jest.fn();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});