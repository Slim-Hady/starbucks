import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Login() {
  const { login, error, setError, isLoggedIn } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email.');
    if (!password) return setError('Please enter your password.');
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      if (success) navigate('/');
    }, 600);
  };

  return (
    <main className="min-h-screen bg-sb-cream flex items-center justify-center px-4 py-16">
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl p-8 sm:p-10 fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sb-green flex items-center justify-center text-white font-black text-3xl shadow-lg mx-auto mb-4">S</div>
          <h1 className="text-3xl font-black text-sb-dark">Sign In</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back to Starbucks Rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sb-dark font-bold text-sm mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="your@email.com"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sb-green transition"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sb-dark font-bold text-sm mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sb-green transition"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-sb-green w-4 h-4" />
              Remember me
            </label>
            <a href="#" className="text-sb-green font-bold hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sb-green hover:bg-sb-dark text-white font-black py-4 rounded-pill transition-all disabled:opacity-70 text-base"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Don't have an account?{' '}
            <Link to="/rewards" className="text-sb-green font-bold hover:underline">Join Now</Link>
          </p>
          <p className="mt-4 text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
            Demo: <strong>user@starbucks.com</strong> / <strong>password123</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
