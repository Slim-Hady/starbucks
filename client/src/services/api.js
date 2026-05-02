const API_BASE_URL = ''; // Use proxy - relative to vite server

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw { status: response.status, message: data.message || 'Request failed', ...data };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async signup(userData) {
        const data = await this.request('/api/v1/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async login(credentials) {
        const data = await this.request('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async logout() {
        this.removeToken();
    }

    async getMe() {
        return this.request('/api/v1/auth/me');
    }

    // Product endpoints
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/api/v1/products?${queryString}` : '/api/v1/products';
        return this.request(endpoint);
    }

    async getProduct(id) {
        return this.request(`/api/v1/products/${id}`);
    }

    // Category endpoints
    async getCategories() {
        return this.request('/api/v1/categories');
    }

    // Order endpoints
    async createOrder(orderData) {
        return this.request('/api/v1/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    // Payment endpoints
    async createCheckoutSession(productId, quantity = 1) {
        return this.request(`/api/v1/payments/checkout-session/${productId}`, {
            method: 'POST',
            body: JSON.stringify({ quantity }),
        });
    }

    // Admin - Products
    async createProduct(productData) {
        return this.request('/api/v1/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    async updateProduct(id, productData) {
        return this.request(`/api/v1/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(productData),
        });
    }

    async deleteProduct(id) {
        return this.request(`/api/v1/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin - Categories
    async createCategory(categoryData) {
        return this.request('/api/v1/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async updateCategory(id, categoryData) {
        return this.request(`/api/v1/categories/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(categoryData),
        });
    }

    async deleteCategory(id) {
        return this.request(`/api/v1/categories/${id}`, {
            method: 'DELETE',
        });
    }

    // User Orders
    async getMyOrders() {
        return this.request('/api/v1/orders/my-orders');
    }

    // Admin - Orders
    async getAllOrders() {
        return this.request('/api/v1/orders');
    }

    async getOrder(id) {
        return this.request(`/api/v1/orders/${id}`);
    }

    async updateOrderStatus(id, status) {
        return this.request(`/api/v1/orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    // Admin - Users
    async getAllUsers() {
        return this.request('/api/v1/users');
    }
}

export const api = new ApiService();
export default api;