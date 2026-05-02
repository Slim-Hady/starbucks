"use strict";
/**
 * ====================================================================================
 * Test Suite: Auth Middleware Tests
 * ====================================================================================
 * Tests authentication middleware that protects routes and enforces authorization.
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../../src/middleware/authMiddleware");
jest.mock('../../src/models/User', () => ({
    User: {
        findById: jest.fn(),
    },
}));
const User_1 = require("../../src/models/User");
const mockedUser = User_1.User;
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('AuthMiddleware', () => {
    let originalEnv;
    beforeAll(() => {
        originalEnv = process.env;
        process.env = Object.assign(Object.assign({}, originalEnv), { JWT_SECRET: 'test-secret-key' });
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('protect', () => {
        it('should attach user with valid token from header', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ id: 'user123', iat: Date.now() }, 'test-secret-key');
            const req = {
                headers: { authorization: `Bearer ${token}` },
                cookies: {},
            };
            const res = createMockResponse();
            const next = jest.fn();
            mockedUser.findById.mockResolvedValue({
                _id: 'user123',
                changedPasswordAfter: jest.fn().mockReturnValue(false),
            });
            yield (0, authMiddleware_1.protect)(req, res, next);
            expect(next).toHaveBeenCalled();
        }));
        it('should reject request without token', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { headers: {}, cookies: {} };
            const res = createMockResponse();
            const next = jest.fn();
            yield (0, authMiddleware_1.protect)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
        }));
        it('should reject with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                headers: { authorization: 'Bearer invalid-token' },
                cookies: {},
            };
            const res = createMockResponse();
            const next = jest.fn();
            yield (0, authMiddleware_1.protect)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
        }));
        it('should reject if user no longer exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ id: 'nonexistent', iat: Date.now() }, 'test-secret-key');
            const req = {
                headers: { authorization: `Bearer ${token}` },
                cookies: {},
            };
            const res = createMockResponse();
            const next = jest.fn();
            mockedUser.findById.mockResolvedValue(null);
            yield (0, authMiddleware_1.protect)(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
        }));
    });
    describe('restrictTo', () => {
        it('should allow access for authorized role', () => {
            const middleware = (0, authMiddleware_1.restrictTo)('Admin');
            const req = { user: { role: 'Admin' } };
            const res = createMockResponse();
            const next = jest.fn();
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('should deny access for unauthorized role', () => {
            const middleware = (0, authMiddleware_1.restrictTo)('Admin');
            const req = { user: { role: 'Customer' } };
            const res = createMockResponse();
            const next = jest.fn();
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
        });
        it('should allow access for multiple roles', () => {
            const middleware = (0, authMiddleware_1.restrictTo)('Admin', 'Customer');
            const req = { user: { role: 'Customer' } };
            const res = createMockResponse();
            const next = jest.fn();
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=authMiddleware.test.js.map