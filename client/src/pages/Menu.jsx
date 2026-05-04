import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import DrinkCard from '../components/DrinkCard';
import SearchBar from '../components/SearchBar';

export default function Menu() {
    const [searchParams] = useSearchParams();
    const initialCat = searchParams.get('category') || 'all';
    const [activeCategory, setActiveCategory] = useState(initialCat);
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    api.getProducts(),
                    api.getCategories(),
                ]);
                setProducts(productsData.data.products);
                setCategories(categoriesData.data.categories);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load menu. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setVisible(false);
        const timer = setTimeout(() => {
            setVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [activeCategory, query]);

    const filteredProducts = products
        .filter((product) => {
            if (activeCategory !== 'all' && product.categoryName !== activeCategory) return false;
            if (query) {
                const searchLower = query.toLowerCase();
                return (
                    product.name.toLowerCase().includes(searchLower) ||
                    (product.description && product.description.toLowerCase().includes(searchLower))
                );
            }
            return true;
        })
        .sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const handleCategory = (id) => setActiveCategory(id);

    const categoryOptions = [
        { id: 'all', label: 'All', icon: '☕' },
        ...categories.map((cat) => ({
            id: cat._id,
            label: cat.name,
            icon: '✨',
        })),
    ];

    if (loading) {
        return (
            <main className="min-h-screen bg-sb-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sb-green mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading menu...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-sb-cream">
            {/* Page header */}
            <div className="bg-sb-dark text-white py-12 px-4 sm:px-6 text-center">
                <h1 className="text-4xl font-black mb-2">Our Menu</h1>
                <p className="text-gray-300 text-base">Find your perfect drink or bite</p>
            </div>

            {/* Sticky filter + search */}
            <div className="sticky top-16 z-20 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-hide">
                        {categoryOptions.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategory(cat.id)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-pill text-sm font-bold transition-all duration-200 ${
                                    activeCategory === cat.id
                                        ? 'bg-sb-green text-white shadow-md scale-105'
                                        : 'bg-sb-cream text-sb-dark hover:bg-sb-light'
                                }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:border-sb-green focus:ring-2 focus:ring-sb-green focus:border-transparent"
                        >
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                        <div className="w-full sm:w-64">
                            <SearchBar onSearch={setQuery} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold">No items found</h3>
                        <p className="text-sm mt-2">Try a different category or search term.</p>
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                        {filteredProducts.map((product) => (
                            <DrinkCard key={product._id} item={product} />
                        ))}
                    </div>
                )}
                <p className="text-center text-gray-400 text-sm mt-8">
                    {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} shown
                </p>
            </div>
        </main>
    );
}