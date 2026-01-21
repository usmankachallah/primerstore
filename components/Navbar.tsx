
import React, { useState, useEffect } from 'react';
import { User, Cpu, ShoppingBag, ShieldCheck, Home, LogIn, Search, Settings, Zap, X, Loader2, Activity } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate a "Neural Processing" effect when the search query changes
  useEffect(() => {
    if (searchQuery) {
      setIsProcessing(true);
      const timer = setTimeout(() => setIsProcessing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'shop') {
      setView('shop');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const isAdmin = user?.isAdmin;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl flex items-center justify-between px-6 py-3 border border-white/10 gap-4 shadow-2xl">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0" 
          onClick={() => setView('home')}
        >
          <div className="bg-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter gradient-text hidden sm:block">PRIMERSTORE</span>
        </div>

        {/* Enhanced Global Search Bar */}
        {!isAdmin && (
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md relative hidden sm:block group"
          >
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-cyan-400' : 'text-slate-500'}`}>
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className={`w-4 h-4 ${searchQuery ? 'animate-pulse' : ''}`} />
              )}
            </div>
            
            <input 
              type="text" 
              placeholder="Filter the grid..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={`w-full bg-white/5 border rounded-xl py-2 pl-10 pr-10 text-xs focus:outline-none transition-all placeholder:text-slate-600 font-medium ${
                searchQuery ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10'
              }`}
            />

            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-400 transition-colors"
                title="Eject Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Subtle "Scanning" label */}
            {isProcessing && (
              <div className="absolute -bottom-5 left-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                <Activity className="w-2.5 h-2.5 text-cyan-500/50" />
                <span className="text-[8px] font-black text-cyan-500/50 uppercase tracking-widest">Processing Neural Query...</span>
              </div>
            )}
          </form>
        )}

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setView('home')}
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${currentView === 'home' ? 'text-cyan-400' : ''}`}
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>
          
          {!isAdmin && (
            <>
              <button 
                onClick={() => setView('shop')}
                className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${currentView === 'shop' ? 'text-cyan-400' : ''}`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Catalog
              </button>
              <button 
                onClick={() => setView('services')}
                className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${currentView === 'services' ? 'text-cyan-400' : ''}`}
              >
                <Zap className="w-3.5 h-3.5" /> Systems
              </button>
            </>
          )}

          {isAdmin && (
            <button 
              onClick={() => setView('admin')}
              className={`hover:text-purple-400 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${currentView === 'admin' ? 'text-purple-400' : ''}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Command
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!isAdmin && (
            <button 
              className={`sm:hidden p-2 hover:bg-white/5 rounded-full transition-colors ${searchQuery ? 'text-cyan-400' : 'text-slate-300'}`} 
              onClick={() => setView('shop')}
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          
          {!isAdmin && (
            <button 
              onClick={() => setView('cart')}
              className={`p-2 hover:bg-white/5 rounded-full transition-colors group relative ${currentView === 'cart' ? 'text-cyan-400 bg-white/5' : 'text-slate-300'}`}
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-cyan-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {user && (
            <button 
              onClick={() => setView('settings')}
              className={`p-2 hover:bg-white/5 rounded-full transition-colors group ${currentView === 'settings' ? 'text-cyan-400 bg-white/5' : 'text-slate-300'}`}
            >
              <Settings className="w-5 h-5 group-hover:text-cyan-400" />
            </button>
          )}

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
