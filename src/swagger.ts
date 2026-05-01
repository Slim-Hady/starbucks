export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Starbucks API',
        version: '1.0.0',
        description: 'CRUD API for users, products, orders, and categories.',
    },
    servers: [
        {
            url: 'http://localhost:3001/api/v1',
        },
    ],
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    name: { type: 'string', example: 'john_doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'StrongPass123!' },
                    role: { type: 'string', example: 'Customer' },
                    slug: { type: 'string', example: 'john_doe' },
                },
            },
            Category: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string', example: 'Coffee' },
                    description: { type: 'string', example: 'Hot drinks and espresso-based menu items' },
                    slug: { type: 'string', example: 'coffee' },
                },
            },
            Product: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string', example: 'Latte' },
                    price: { type: 'number', example: 4.5 },
                    description: { type: 'string', example: 'Milk coffee drink' },
                    image: { type: 'string', example: 'https://example.com/image.png' },
                    category: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    sizes: { type: 'array', items: { type: 'string' }, example: ['S', 'M', 'L'] },
                    isAvailable: { type: 'boolean', example: true },
                    slug: { type: 'string', example: 'latte' },
                },
            },
            OrderItem: {
                type: 'object',
                properties: {
                    product: { type: 'string', example: '507f1f77bcf86cd799439013' },
                    size: { type: 'string', example: 'M' },
                    quantity: { type: 'number', example: 2 },
                    price: { type: 'number', example: 9 },
                },
            },
            Order: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    user: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    items: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/OrderItem' },
                    },
                    totalPrice: { type: 'number', example: 18 },
                    status: { type: 'string', example: 'Pending' },
                },
            },
        },
        parameters: {
            idParam: {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
            },
        },
    },
    paths: {
        '/auth/signup': {
            post: {
                tags: ['Auth'],
                summary: 'Create a new account',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
                },
                responses: { 201: { description: 'Account created' } },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Log in with email and password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'john@example.com' },
                                    password: { type: 'string', example: 'StrongPass123!' },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Logged in' } },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get the current logged-in user',
                responses: { 200: { description: 'Current user' } },
            },
        },
        '/users': {
            get: {
                tags: ['Users'],
                summary: 'Get all users',
                responses: { 200: { description: 'List of users' } },
            },
            post: {
                tags: ['Users'],
                summary: 'Create a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' },
                        },
                    },
                },
                responses: { 201: { description: 'User created' } },
            },
        },
        '/users/{id}': {
            get: {
                tags: ['Users'],
                summary: 'Get one user',
                parameters: [{ $ref: '#/components/parameters/idParam' }],
                responses: { 200: { description: 'Single user' } },
            },
            patch: {
                tags: ['Users'],
                summary: 'Update a user',
                parameters: [{ $ref: '#/components/parameters/idParam' }],
                responses: { 200: { description: 'User updated' } },
            },
            delete: {
                tags: ['Users'],
                summary: 'Delete a user',
                parameters: [{ $ref: '#/components/parameters/idParam' }],
                responses: { 200: { description: 'User deleted' } },
            },
        },
        '/categories': {
            get: { tags: ['Categories'], summary: 'Get all categories', responses: { 200: { description: 'List of categories' } } },
            post: {
                tags: ['Categories'],
                summary: 'Create a category',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } },
                },
                responses: { 201: { description: 'Category created' } },
            },
        },
        '/categories/{id}': {
            get: { tags: ['Categories'], summary: 'Get one category', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Single category' } } },
            patch: { tags: ['Categories'], summary: 'Update a category', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Category updated' } } },
            delete: { tags: ['Categories'], summary: 'Delete a category', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Category deleted' } } },
        },
        '/products': {
            get: { tags: ['Products'], summary: 'Get all products', responses: { 200: { description: 'List of products' } } },
            post: {
                tags: ['Products'],
                summary: 'Create a product',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } },
                },
                responses: { 201: { description: 'Product created' } },
            },
        },
        '/products/{id}': {
            get: { tags: ['Products'], summary: 'Get one product', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Single product' } } },
            patch: { tags: ['Products'], summary: 'Update a product', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Product updated' } } },
            delete: { tags: ['Products'], summary: 'Delete a product', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Product deleted' } } },
        },
        '/orders': {
            get: { tags: ['Orders'], summary: 'Get all orders', responses: { 200: { description: 'List of orders' } } },
            post: {
                tags: ['Orders'],
                summary: 'Create an order',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
                },
                responses: { 201: { description: 'Order created' } },
            },
        },
        '/orders/{id}': {
            get: { tags: ['Orders'], summary: 'Get one order', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Single order' } } },
            patch: { tags: ['Orders'], summary: 'Update an order', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Order updated' } } },
            delete: { tags: ['Orders'], summary: 'Delete an order', parameters: [{ $ref: '#/components/parameters/idParam' }], responses: { 200: { description: 'Order deleted' } } },
        },
        '/payments/checkout-session/{productId}': {
            post: {
                tags: ['Payments'],
                summary: 'Create a Stripe checkout session for one product',
                parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    quantity: { type: 'number', example: 1 },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Checkout session created' } },
            },
        },
    },
};
