import React from 'react';
import { ShoppingCart, User, Cpu, ShieldCheck, Home, Package, LogIn } from 'lucide-react';
import { View, User as UserType } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
  user: UserType | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount, user }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl flex items-center justify-between px-6 py-3 border border-white/10">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => setView('home')}
        >
          <div className="bg-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter gradient-text">PRIMERSTORE</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
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

        <div className="flex items-center gap-4">
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