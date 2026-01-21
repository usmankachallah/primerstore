
import React from 'react';
import { ShoppingCart, User, Cpu, ShieldCheck, Home, Package, LogIn, Info, MessageCircle, Search } from 'lucide-react';
import { View, User as UserType } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
  user: UserType | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount, user, searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value && currentView !== 'shop') {
      setView('shop');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl flex items-center justify-between px-6 py-3 border border-white/10 gap-4">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0" 
          onClick={() => setView('home')}
        >
          <div className="bg-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter gradient-text hidden sm:block">PRIMERSTORE</span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search the matrix..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setView('home')}
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${currentView === 'home' ? 'text-cyan-400' : ''}`}
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button 
            onClick={() => setView('shop')}
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${currentView === 'shop' ? 'text-cyan-400' : ''}`}
          >
            <Package className="w-4 h-4" /> Products
          </button>
          {user?.isAdmin && (
            <button 
              onClick={() => setView('admin')}
              className={`hover:text-purple-400 transition-colors flex items-center gap-1.5 ${currentView === 'admin' ? 'text-purple-400' : ''}`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button className="sm:hidden p-2 hover:bg-white/5 rounded-full text-slate-300" onClick={() => setView('shop')}>
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('cart')}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors group"
          >
            <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-cyan-400" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setView(user ? 'profile' : 'auth')}
            className={`p-2 hover:bg-white/5 rounded-full transition-colors group flex items-center gap-2 ${currentView === 'profile' || currentView === 'auth' ? 'text-cyan-400 bg-white/5' : 'text-slate-300'}`}
          >
            {user ? (
              <User className="w-5 h-5 group-hover:text-cyan-400" />
            ) : (
              <LogIn className="w-5 h-5 group-hover:text-cyan-400" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
