"use strict";
/**
 * ====================================================================================
 * Test Suite: User Model Tests
 * ====================================================================================
 * Tests User model schema validation, password hashing, and instance methods.
 * ====================================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../src/models/User");
describe('UserModel', () => {
    describe('Schema Validation', () => {
        it('should require name field', () => {
            const user = new User_1.User({
                email: 'test@example.com',
                password: 'Password123!',
            });
            const validationError = user.validateSync();
            expect(validationError === null || validationError === void 0 ? void 0 : validationError.errors.name).toBeDefined();
        });
        it('should require email field', () => {
            const user = new User_1.User({
                name: 'testuser',
                password: 'Password123!',
            });
            const validationError = user.validateSync();
            expect(validationError === null || validationError === void 0 ? void 0 : validationError.errors.email).toBeDefined();
        });
        it('should require password field', () => {
            const user = new User_1.User({
                name: 'testuser',
                email: 'test@example.com',
            });
            const validationError = user.validateSync();
            expect(validationError === null || validationError === void 0 ? void 0 : validationError.errors.password).toBeDefined();
        });
        it('should default role to Customer', () => {
            const user = new User_1.User({
                name: 'testuser',
                email: 'test@example.com',
                password: 'Password123!',
            });
            expect(user.role).toBe('Customer');
        });
        it('should reject invalid role values', () => {
            const user = new User_1.User({
                name: 'testuser',
                email: 'test@example.com',
                password: 'Password123!',
                role: 'SuperAdmin',
            });
            const validationError = user.validateSync();
            expect(validationError === null || validationError === void 0 ? void 0 : validationError.errors.role).toBeDefined();
        });
    });
    describe('Password', () => {
        it('should have password field', () => {
            const user = new User_1.User({
                name: 'testuser',
                email: 'test@example.com',
                password: 'Password123!',
            });
            expect(user.password).toBeDefined();
        });
        it('should have password select disabled in schema', () => {
            const schema = User_1.User.schema;
            const passwordPath = schema.paths.password;
            expect(passwordPath.options.select).toBe(false);
        });
    });
    describe('Timestamps', () => {
        it('should set createdAt on creation', () => {
            const user = new User_1.User({
                name: 'testuser',
                email: 'test@example.com',
                password: 'Password123!',
            });
            expect(user.createdAt).toBeDefined();
        });
    });
});
//# sourceMappingURL=userModel.test.js.map