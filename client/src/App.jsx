import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import Rewards from './pages/Rewards';
import Login from './pages/Login';
import Cart from './pages/Cart';

function GiftCards() {
  return <div className="min-h-screen flex items-center justify-center bg-sb-cream"><div className="text-center py-20"><h2 className="text-3xl font-black text-sb-dark">Gift Cards</h2><p className="text-gray-500 mt-3">Coming soon — buy the perfect gift for a Starbucks lover.</p></div></div>;
}

function FindStore() {
  return <div className="min-h-screen flex items-center justify-center bg-sb-cream"><div className="text-center py-20"><h2 className="text-3xl font-black text-sb-dark">Find a Store</h2><p className="text-gray-500 mt-3">Store locator coming soon.</p></div></div>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<ProductDetail />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/find-a-store" element={<FindStore />} />
      </Routes>
      <Footer />
    </>
  );
}
