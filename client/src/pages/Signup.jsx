import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Signup() {
    const { signup, error, setError, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (isLoggedIn) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            return setError('Please fill in all fields.');
        }
        
        setLoading(true);
        const success = await signup({ name, email, password });
        setLoading(false);
        
        if (success) navigate('/');
    };

    return (
        <main className="min-h-screen bg-sb-cream flex items-center justify-center px-4 py-16">
            <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl p-8 sm:p-10 fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-sb-green flex items-center justify-center text-white font-black text-3xl shadow-lg mx-auto mb-4">S</div>
                    <h1 className="text-3xl font-black text-sb-dark">Create Account</h1>
                    <p className="text-gray-500 text-sm mt-1">Join Starbucks Rewards today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sb-dark font-bold text-sm mb-1.5">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="Your name"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sb-green transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sb-dark font-bold text-sm mb-1.5">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            placeholder="your@email.com"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sb-green transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sb-dark font-bold text-sm mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            placeholder="Min 8 characters"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sb-green transition"
                            minLength={8}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters with letters and numbers</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sb-green hover:bg-sb-dark text-white font-black py-4 rounded-pill transition-all disabled:opacity-70 text-base"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Already have an account?{' '}
                        <Link to="/login" className="text-sb-green font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}