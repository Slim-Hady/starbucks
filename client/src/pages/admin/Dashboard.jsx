import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'Admin') {
            navigate('/');
            return;
        }
        fetchStats();
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
                api.getProducts(),
                api.getCategories(),
                api.getAllOrders(),
                api.getAllUsers(),
            ]);
            setStats({
                products: productsRes.data.products?.length || 0,
                categories: categoriesRes.data.categories?.length || 0,
                orders: ordersRes.data.data?.length || 0,
                users: usersRes.data.data?.length || 0,
            });
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const cards = [
        { title: 'Products', count: stats.products, link: '/admin/products', color: 'bg-emerald-500', icon: '☕' },
        { title: 'Categories', count: stats.categories, link: '/admin/categories', color: 'bg-amber-500', icon: '📁' },
        { title: 'Orders', count: stats.orders, link: '/admin/orders', color: 'bg-blue-500', icon: '📦' },
        { title: 'Users', count: stats.users, link: '/admin/users', color: 'bg-purple-500', icon: '👥' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-green-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-black">Admin Dashboard</h1>
                    <p className="mt-2 text-green-100">Manage your Starbucks store</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cards.map((card) => (
                        <Link
                            key={card.title}
                            to={card.link}
                            className={`${card.color} text-white rounded-lg p-6 shadow-lg hover:scale-105 transition-transform`}
                        >
                            <div className="text-4xl mb-2">{card.icon}</div>
                            <div className="text-3xl font-bold">{card.count}</div>
                            <div className="text-white/80">{card.title}</div>
                        </Link>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/admin/products"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            + Add Product
                        </Link>
                        <Link
                            to="/admin/categories"
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                        >
                            + Add Category
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}