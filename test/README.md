# Test Suite - Complete Guide

This folder contains comprehensive tests for the Starbucks backend application.

---

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Running Tests](#running-tests)
3. [Test Categories](#test-categories)
4. [Performance Testing](#performance-testing)
5. [Code Coverage](#code-coverage)
6. [Writing Tests](#writing-tests)
7. [Test Tips & Best Practices](#test-tips--best-practices)

---

## Folder Structure

```
test/
├── README.md                    # This file
├── controllers/                # Controller unit tests
│   ├── userController.test.ts
│   ├── productController.test.ts
│   ├── categoryController.test.ts
│   ├── orderController.test.ts
│   ├── authController.test.ts
│   └── paymentController.test.ts
├── models/                     # Model unit tests
│   ├── userModel.test.ts
│   ├── productModel.test.ts
│   ├── categoryModel.test.ts
│   └── orderModel.test.ts
├── middleware/                # Middleware tests
│   └── authMiddleware.test.ts
├── utils/                     # Utility function tests
│   └── apiFeature.test.ts
├── edgeCases/                 # Edge case & validation tests
│   └── validationEdgeCases.test.ts
└── performance/               # Performance & timing tests
    └── timing.test.ts
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (Auto-reload)
```bash
npm run test:watch
```

### Run Specific Test File
```bash
npx jest test/controllers/userController.test.ts
```

### Run Tests by Pattern
```bash
# Run all controller tests
npx jest test/controllers

# Run all model tests
npx jest test/models

# Run all edge case tests
npx jest test/edgeCases
```

### Run Tests with Coverage Report
```bash
npx jest --coverage
```

### Run Performance Tests Only
```bash
npx jest test/performance/
```

### Run a Specific Test by Name
```bash
npx jest --testNamePattern="getAllUsers"
```

---

## Test Categories

### 1. Controller Tests (`test/controllers/`)

**What they test:**
- HTTP request/response handling
- Business logic in controllers
- Error handling and status codes
- Data transformation

**Files:**
| File | Coverage |
|------|----------|
| `userController.test.ts` | User CRUD, ID validation |
| `productController.test.ts` | Product CRUD, ID validation |
| `categoryController.test.ts` | Category CRUD, ID validation |
| `orderController.test.ts` | Order CRUD, status management |
| `authController.test.ts` | Login, signup, password reset |
| `paymentController.test.ts` | Stripe checkout sessions |

### 2. Model Tests (`test/models/`)

**What they test:**
- Schema validation
- Pre/post middleware
- Instance methods
- Default values
- Required fields

**Files:**
| File | Coverage |
|------|----------|
| `userModel.test.ts` | Validation, password hashing, methods |
| `productModel.test.ts` | Schema validation, slug generation |
| `categoryModel.test.ts` | Category schema |
| `orderModel.test.ts` | Order items, status enum |

### 3. Middleware Tests (`test/middleware/`)

**What they test:**
- Authentication
- Authorization
- Request validation
- Error handling

**Files:**
| File | Coverage |
|------|----------|
| `authMiddleware.test.ts` | JWT verification, role-based access |

### 4. Utility Tests (`test/utils/`)

**What they test:**
- Helper functions
- Query builders
- Data transformation

**Files:**
| File | Coverage |
|------|----------|
| `apiFeature.test.ts` | Filter, sort, pagination, field selection |

### 5. Edge Case Tests (`test/edgeCases/`)

**What they test:**
- Invalid input handling
- Boundary conditions
- Security edge cases
- Type coercion

**Files:**
| File | Coverage |
|------|----------|
| `validationEdgeCases.test.ts` | SQL injection, XSS, unicode, null values |

### 6. Performance Tests (`test/performance/`)

**What they test:**
- Execution time
- Memory usage
- Scalability
- Caching benefits

**Files:**
| File | Coverage |
|------|----------|
| `timing.test.ts` | All operations performance |

---

## Performance Testing

### How to Test Performance

Performance tests measure how long operations take and ensure they complete within acceptable time limits.

#### Running Performance Tests

```bash
# Run all performance tests
npx jest test/performance/

# Run with verbose output
npx jest test/performance/ --verbose

# Run with coverage
npx jest test/performance/ --coverage
```

#### Performance Targets

| Operation Type | Target Time |
|----------------|-------------|
| Database queries | < 100ms |
| Controller operations | < 50ms |
| Middleware operations | < 10ms |
| Utility functions | < 5ms |

#### Understanding Test Output

When you run performance tests, you'll see output like:

```
✓ should measure getAllUsers performance (12.34ms)
✓ should measure large dataset filtering (45.67ms)
✓ should measure pagination calculation (2.10ms)
```

The time shown is in milliseconds (ms). The test passes if it's below the target.

#### Time Complexity

The tests also help identify time complexity:

- **O(1)**: Constant - doesn't scale with input
- **O(log n)**: Logarithmic - doubles input, adds one operation
- **O(n)**: Linear - scales directly with input
- **O(n log n)**: Linearithmic - usually sorting
- **O(n²)**: Quadratic - nested loops

#### Example: Testing Your Own Functions

```typescript
const measureExecution = (fn: Function): number => {
    const start = performance.now();
    fn();
    return performance.now() - start;
};

// Test your function
const time = measureExecution(() => {
    myFunction(data);
});

console.log(`Execution time: ${time.toFixed(2)}ms`);
expect(time).toBeLessThan(50); // Must be under 50ms
```

---

## Code Coverage

### Generate Coverage Report

```bash
npx jest --coverage
```

### Coverage Report Location

After running, open:
```
coverage/lcov-report/index.html
```

### Coverage Types

| Type | Description |
|------|-------------|
| **Line** | % of lines executed |
| **Branch** | % of code branches taken |
| **Functions** | % of functions called |
| **Statements** | % of statements executed |

### Target Coverage

- Minimum: **70%**
- Good: **80%**
- Excellent: **90%+**

---

## Writing Tests

### Test Structure

```typescript
describe('FeatureName', () => {
    beforeEach(() => {
        // Setup before each test
    });

    afterEach(() => {
        // Cleanup after each test
    });

    it('should do something specific', async () => {
        // Arrange - set up test data
        // Act - perform the action
        // Assert - check the result
    });
});
```

### Mocking Examples

```typescript
// Mock a model
jest.mock('../../src/models/User', () => ({
    User: {
        find: jest.fn(),
        create: jest.fn(),
    },
}));

// Mock a utility
jest.mock('../../src/utils/APIFeature', () => jest.fn());
```

### Testing Async Functions

```typescript
it('should create a user', async () => {
    const req = { body: { name: 'John' } } as unknown as Request;
    const res = createMockResponse();

    mockedUser.create.mockResolvedValue({ _id: '1', name: 'John' });

    await CreateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
});
```

### Testing Middleware

```typescript
it('should call next with error on invalid token', async () => {
    const req = { headers: {} } as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401 })
    );
});
```

---

## Test Tips & Best Practices

### 1. Use Descriptive Test Names

```typescript
// ❌ Bad
it('test1', () => { });

// ✅ Good
it('should return 401 for invalid credentials', () => { });
```

### 2. Follow AAA Pattern

```typescript
it('should calculate total correctly', () => {
    // Arrange
    const items = [{ price: 10 }, { price: 20 }];

    // Act
    const total = calculateTotal(items);

    // Assert
    expect(total).toBe(30);
});
```

### 3. Test Edge Cases

```typescript
it('should handle empty array', () => {
    const result = processItems([]);
    expect(result).toEqual([]);
});

it('should handle null input', () => {
    expect(() => processItems(null)).toThrow();
});
```

### 4. Keep Tests Independent

```typescript
afterEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
});
```

### 5. Test Error Paths

```typescript
it('should return 500 on database error', async () => {
    mockedUser.find.mockRejectedValue(new Error('DB error'));

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
});
```

### 6. Use describe Blocks

```typescript
describe('UserController', () => {
    describe('getUser', () => {
        it('returns user when found', () => { });
        it('returns 404 when not found', () => { });
    });

    describe('CreateUser', () => {
        it('creates user with valid data', () => { });
        it('rejects invalid email', () => { });
    });
});
```

---

## Troubleshooting

### Tests Fail with "Cannot find module"

```bash
npm install
```

### TypeScript Errors in Tests

Make sure `tsconfig.test.json` includes test folder:
```json
{
  "include": ["src/**/*", "test/**/*"]
}
```

### Memory Issues

```bash
NODE_OPTIONS=--max_old_space_size=4096 npm test
```

### Slow Tests

```bash
npm run test:watch  # Run in watch mode
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Run all tests | `npm test` |
| Run watch mode | `npm run test:watch` |
| Run specific file | `npx jest test/path/file.test.ts` |
| Run by pattern | `npx jest --testNamePattern="name"` |
| Run with coverage | `npx jest --coverage` |
| Clear cache | `npx jest --clearCache` |

---

## Test File Header Format

Each test file should include a header comment explaining:

```typescript
/**
 * ====================================================================================
 * Test Suite: [Name] Tests
 * ====================================================================================
 * 
 * WHAT THIS FILE TESTS:
 * =====================
 * [Description of what is tested]
 * 
 * COVERAGE:
 * ---------
 * [List of functions/features tested]
 * 
 * EDGE CASES TESTED:
 * ------------------
 * [List of edge cases covered]
 * 
 * PERFORMANCE NOTES:
 * ------------------
 * [Performance expectations if any]
 * ====================================================================================
 */
```

This helps other developers understand what each test file covers!

---

## Next Steps

1. **Add more tests** - Cover untested endpoints
2. **Increase coverage** - Aim for 80%+
3. **Add integration tests** - Test full request/response cycle
4. **Add E2E tests** - Test user workflows with tools like Cypress
5. **Set up CI** - Run tests automatically on git push

---

Happy Testing! 🚀