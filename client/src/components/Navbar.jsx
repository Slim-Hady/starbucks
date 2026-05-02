import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, setIsOpen } = useCart();
  const { isLoggedIn, user, logout } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/menu', label: 'Menu' },
    { to: '/rewards', label: 'Rewards' },
    { to: '/gift-cards', label: 'Gift Cards' },
    { to: '/find-a-store', label: 'Find a Store' },
  ];

  const linkClass = ({ isActive }) =>
    `font-bold text-sm transition-colors ${isActive ? 'text-sb-green border-b-2 border-sb-green pb-0.5' : 'text-sb-black hover:text-sb-green'}`;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-sb-green flex items-center justify-center text-white font-black text-xl shadow">S</div>
          <span className="font-black text-sb-dark text-lg hidden sm:block tracking-wide">STARBUCKS</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.to}><NavLink to={l.to} className={linkClass}>{l.label}</NavLink></li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link to="/menu" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-sb-light transition" aria-label="Search">
            <span className="text-lg">🔍</span>
          </Link>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-bold text-sb-dark">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="border-2 border-sb-green text-sb-green font-bold text-sm px-4 py-1.5 rounded-pill hover:bg-sb-green hover:text-white transition">Sign Out</button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-block border-2 border-sb-green text-sb-green font-bold text-sm px-4 py-1.5 rounded-pill hover:bg-sb-green hover:text-white transition">Sign In</Link>
          )}

          <button onClick={() => setIsOpen(true)} className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-sb-light transition" aria-label="Cart">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-sb-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-sb-light transition" aria-label="Menu">
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 shadow-lg fade-in">
          <ul className="flex flex-col gap-3 pt-4">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={linkClass} onClick={() => setMenuOpen(false)}>{l.label}</NavLink>
              </li>
            ))}
            {isLoggedIn ? (
              <li><button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-sb-green font-bold text-sm">Sign Out</button></li>
            ) : (
              <li><Link to="/login" className="block bg-sb-green text-white font-bold text-center py-2 rounded-pill hover:bg-sb-dark transition" onClick={() => setMenuOpen(false)}>Sign In</Link></li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
