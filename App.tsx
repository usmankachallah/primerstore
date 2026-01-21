
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ChatSupport from './components/ChatSupport';
import AdminPanel from './components/AdminPanel';
import ProductModal from './components/ProductModal';
import AuthPage from './components/AuthPage';
import AdminAuthPage from './components/AdminAuthPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import { Product, CartItem, Order, OrderStatus, View, User } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './constants';
import { 
  ShoppingBag, ArrowRight, Star, ArrowLeft, CreditCard, 
  CheckCircle2, Search, Filter, Package, Cpu, 
  User as UserIcon, Settings, Heart, LayoutDashboard, 
  History, Shield, ShieldCheck, MapPin, Phone, Mail, Trash2, Zap, DollarSign, LogOut, Lock,
  Wallet, Fingerprint, Activity, Key, Eye, EyeOff, AlertTriangle
} from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<View>('home');
  const [profileTab, setProfileTab] = useState<'overview' | 'orders' | 'wishlist' | 'settings'>('overview');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- Derived State ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p.id));
  }, [products, wishlist]);

  const totalSpent = useMemo(() => {
    return orders.reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  // --- Handlers ---
  const handleLogin = (userData: User) => {
    setUser(userData);
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
      ? prev.filter(id => id !== productId) 
      : [...prev, productId]
    );
  };

  const placeOrder = (customerDetails: { address: string, phone: string, name: string }) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6),
      items: [...cart],
      total: cartTotal,
      status: OrderStatus.PENDING,
      date: new Date().toLocaleDateString(),
      customerName: customerDetails.name,
      address: customerDetails.address,
      phone: customerDetails.phone
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setView('order-confirmation');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleProductClick = (p: Product) => {
    setSelectedProduct(p);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Identity parameters updated successfully.");
  };

  // --- Views ---
  const renderHome = () => (
    <div className="space-y-24 pb-24">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 blur-[2px]"
            alt="Cyberpunk background"
          />
        </div>
        <div className="relative z-20 text-center max-w-4xl px-6 animate-in fade-in zoom-in duration-1000">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border border-cyan-500/20">
            Evolution of Commerce
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
            THE FUTURE IS <br />
            <span className="gradient-text">PRIMER</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of digital retail. Precision-engineered gear for the modern human.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setView('shop')}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/20"
            >
              Initialize Shopping <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setView('about')} className="px-8 py-4 glass hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10">
              View Roadmap
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black mb-2">Featured Tech</h2>
            <p className="text-slate-500">Curated for maximum performance.</p>
          </div>
          <button onClick={() => setView('shop')} className="text-cyan-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            See all catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map(p => (
            <div 
              key={p.id} 
              className="group glass rounded-3xl p-4 border border-white/10 transition-all hover:-translate-y-2 hover:border-cyan-500/50 cursor-pointer"
              onClick={() => handleProductClick(p)}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] font-bold">4.9</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition-colors">{p.name}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">${p.price}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                  className="p-3 bg-white/5 hover:bg-cyan-600 rounded-xl transition-all group/btn"
                >
                  <ShoppingBag className="w-5 h-5 text-slate-400 group-hover/btn:text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderShop = () => (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2">Neural Catalog</h1>
          <p className="text-slate-500">Discover hardware beyond your imagination.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'glass text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search the grid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <button className="glass p-3 rounded-2xl border border-white/10 hover:border-cyan-500 transition-colors">
          <Filter className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="group glass rounded-3xl p-4 border border-white/10 transition-all hover:border-cyan-500/30 cursor-pointer" onClick={() => handleProductClick(p)}>
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
              {p.stock < 10 && <span className="absolute bottom-4 left-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md">LOW STOCK</span>}
            </div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold group-hover:text-cyan-400 transition-colors">{p.name}</h3>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{p.category}</span>
            </div>
            <p className="text-xs text-slate-500 mb-6 line-clamp-1">{p.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black">${p.price}</span>
              <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">Deploy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="max-w-4xl mx-auto px-6 py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => setView('shop')} className="p-2 glass rounded-full hover:bg-white/10 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-4xl font-black">Memory Core <span className="text-slate-600">(Cart)</span></h1>
      </div>
      {cart.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="glass rounded-2xl p-4 border border-white/10 flex items-center gap-6">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} />
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-xs text-slate-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-1 border border-white/5">
                  <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg font-bold">-</button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg font-bold">+</button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-black text-lg">${item.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-400 hover:underline mt-1 font-bold">EJECT</button>
                </div>
              </div>
            ))}
          </div>
          <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
            <div className="flex justify-between items-center text-slate-400"><span>Neural Subtotal</span><span className="font-bold">${cartTotal}</span></div>
            <div className="h-px bg-white/10 w-full" />
            <div className="flex justify-between items-center text-2xl"><span className="font-black">Total Matrix Cost</span><span className="font-black text-cyan-400">${cartTotal}</span></div>
            <button onClick={() => setView(user ? 'checkout' : 'auth')} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">Initiate Checkout Protocol <ArrowRight className="w-5 h-5" /></button>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 glass rounded-3xl border border-white/10">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Memory core is empty</h3>
          <button onClick={() => setView('shop')} className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold">Back to Grid</button>
        </div>
      )}
    </div>
  );

  const renderCheckout = () => {
    const [formData, setFormData] = useState({ name: user?.name || '', address: user?.address || '', phone: user?.phone || '' });
    const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Crypto Wallet' | 'Cybernetic Transfer'>('Credit Card');

    const paymentOptions = [
      { id: 'Credit Card', icon: <CreditCard className="w-5 h-5" />, label: 'Standard Sync', desc: 'Credit/Debit Card' },
      { id: 'Crypto Wallet', icon: <Wallet className="w-5 h-5" />, label: 'Block Vault', desc: 'Web3 / Crypto' },
      { id: 'Cybernetic Transfer', icon: <Activity className="w-5 h-5" />, label: 'Neural Link', desc: 'Direct Transfer' }
    ] as const;

    return (
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('cart')} className="p-2 glass rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-black">Security Clearance</h1>
          </div>
          
          {/* Identity & Deployment Data */}
          <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <UserIcon className="w-3.5 h-3.5" /> Deployment Parameters
            </h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" />
              <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" />
              <textarea placeholder="Delivery Coordinates" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" rows={3} />
            </div>
          </div>

          {/* Transaction Protocol Selection */}
          <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Shield className="w-3.5 h-3.5" /> Transaction Protocol
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setPaymentMethod(option.id)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all text-center relative overflow-hidden group ${
                    paymentMethod === option.id 
                    ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                    : 'glass border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {paymentMethod === option.id && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                  )}
                  <div className={`p-2 rounded-lg transition-colors ${paymentMethod === option.id ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === option.id ? 'text-white' : 'text-slate-400'}`}>
                      {option.label}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold mt-0.5">{option.desc}</p>
                  </div>
                  {paymentMethod === option.id && (
                    <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => placeOrder(formData)} 
            disabled={!formData.name || !formData.address || !formData.phone} 
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-2xl font-bold shadow-xl shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Fingerprint className="w-5 h-5" />
            Authorize Transaction
          </button>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-3xl p-8 border border-white/10 h-fit">
            <h3 className="text-xl font-black mb-6">Manifest Summary</h3>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover border border-white/5" alt={item.name} />
                    <div>
                      <span className="font-bold">{item.name}</span>
                      <p className="text-[10px] text-slate-500">{item.quantity} Unit(s)</p>
                    </div>
                  </div>
                  <span className="font-black">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10 w-full mb-6" />
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                <span>Network Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                <span>Protocol Sync</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl font-black">
              <span>Total Credits</span>
              <span className="text-cyan-400">${cartTotal}</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 flex items-center gap-4 bg-cyan-500/5">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-0.5">Quantum-Safe Encryption</p>
              <p className="text-[9px] text-slate-500 font-bold">Your biometric and financial data is processed within a secure isolated sandbox.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePasswordChange = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Neural password encryption successful. Uplink re-secured.");
    };

    const confirmAccountDeletion = () => {
      if (window.confirm("FATAL ERROR: This will permanently erase your neural presence from PRIMER matrix. Proceed?")) {
        handleLogout();
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:w-1/4 space-y-4">
            <div className="glass rounded-3xl p-6 border border-white/10 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500/20 mx-auto">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-full h-full object-cover" alt="Profile avatar" />
                </div>
              </div>
              <h2 className="text-xl font-black">{user?.name}</h2>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Citizen Unit #{user?.id.slice(0, 6).toUpperCase()}</p>
            </div>

            <div className="glass rounded-3xl p-2 border border-white/10 flex flex-col">
              <button 
                onClick={() => setProfileTab('overview')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${profileTab === 'overview' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Neural Overview
              </button>
              <button 
                onClick={() => setProfileTab('orders')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${profileTab === 'orders' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <History className="w-4 h-4" /> Order Ledger
              </button>
              <button 
                onClick={() => setProfileTab('wishlist')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${profileTab === 'wishlist' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Heart className="w-4 h-4" /> Memory Bank
              </button>
              <button 
                onClick={() => setProfileTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${profileTab === 'settings' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Settings className="w-4 h-4" /> System Parameters
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-3xl text-sm font-black border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" /> Sever Uplink
            </button>

            {user?.isAdmin && (
              <button 
                onClick={() => setView('admin')}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-3xl text-sm font-black border border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 transition-all uppercase tracking-widest"
              >
                <Shield className="w-4 h-4" /> Enter Command Center
              </button>
            )}
          </div>

          {/* Right Content Area */}
          <div className="lg:w-3/4">
            {profileTab === 'overview' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                    <Zap className="w-8 h-8 text-cyan-400 mb-4" />
                    <p className="text-3xl font-black mb-1">{orders.length}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Successful Transmissions</p>
                  </div>
                  <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                    <DollarSign className="w-8 h-8 text-purple-400 mb-4" />
                    <p className="text-3xl font-black mb-1">${totalSpent}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Credits Invested</p>
                  </div>
                  <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                    <Heart className="w-8 h-8 text-rose-400 mb-4" />
                    <p className="text-3xl font-black mb-1">{wishlist.length}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Memory Bank Items</p>
                  </div>
                </div>

                <div className="glass rounded-3xl p-8 border border-white/10">
                  <h3 className="text-xl font-black mb-6">Recent Activity Hub</h3>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-cyan-500/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan-500/10 rounded-xl">
                              <Package className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-bold text-sm group-hover:text-cyan-400 transition-colors">Transmission #{o.id.toUpperCase()}</p>
                              <p className="text-xs text-slate-500">{o.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-sm">${o.total}</p>
                            <span className={`text-[10px] uppercase font-black tracking-widest ${
                              o.status === OrderStatus.DELIVERED ? 'text-green-400' : 
                              o.status === OrderStatus.PENDING ? 'text-yellow-400' : 'text-cyan-500'
                            }`}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500 italic">No recent transmissions detected in the sector.</p>
                      <button onClick={() => setView('shop')} className="mt-4 text-cyan-400 text-sm font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
                        Initialize First Order <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profileTab === 'orders' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">Transmission Archive</h3>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-400" /> Sync Active
                  </div>
                </div>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(o => (
                      <div key={o.id} className="glass rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div>
                            <p className="font-mono text-cyan-400 text-lg mb-1">#{o.id.toUpperCase()}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{o.date} • {o.items.length} Modules</p>
                            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5 font-bold">
                              <MapPin className="w-2.5 h-2.5" /> {o.address}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 ${
                              o.status === OrderStatus.DELIVERED ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              o.status === OrderStatus.PENDING ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {o.status}
                            </span>
                            <p className="text-xl font-black">${o.total}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {o.items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-2xl p-2 border border-white/5">
                              <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt={item.name} />
                              <div>
                                <p className="text-xs font-bold truncate max-w-[120px]">{item.name}</p>
                                <p className="text-[10px] text-slate-500">{item.quantity}x • ${item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-3xl p-12 text-center border border-white/10">
                    <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Archive is currently empty.</p>
                    <button onClick={() => setView('shop')} className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all">
                      Browse Inventory
                    </button>
                  </div>
                )}
              </div>
            )}

            {profileTab === 'wishlist' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-black">Memory Bank</h3>
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map(p => (
                      <div key={p.id} className="group glass rounded-3xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all">
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 cursor-pointer" onClick={() => handleProductClick(p)}>
                          <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                            className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-xl text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold mb-1 truncate">{p.name}</h4>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-black">${p.price}</span>
                          <button 
                            onClick={() => addToCart(p)}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest"
                          >
                            Deploy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-3xl p-12 text-center border border-white/10">
                    <Heart className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Memory bank is vacant. Start cataloging gear.</p>
                    <button onClick={() => setView('shop')} className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all">
                      Browse Grid
                    </button>
                  </div>
                )}
              </div>
            )}

            {profileTab === 'settings' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-black">System Parameters</h3>
                
                {/* Identity Section */}
                <div className="glass rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center gap-2 mb-6 text-cyan-400">
                    <UserIcon className="w-4 h-4" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Biological Data</h4>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Designation</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text" 
                            defaultValue={user?.name}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comms Uplink (Phone)</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text" 
                            defaultValue={user?.phone}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Deployment Node (Address)</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                        <textarea 
                          defaultValue={user?.address}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        type="submit"
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest text-xs"
                      >
                        Commit Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Security Section */}
                <div className="glass rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center gap-2 mb-6 text-purple-400">
                    <Shield className="w-4 h-4" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Security Protocol</h4>
                  </div>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Encryption Key</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Neural Key</label>
                          <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                              type="password"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Sync Key</label>
                          <div className="relative">
                            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                              type="password"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        type="submit"
                        className="px-8 py-3 glass border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-2xl font-black transition-all shadow-xl shadow-purple-500/10 uppercase tracking-widest text-xs"
                      >
                        Refresh Encryption
                      </button>
                    </div>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="glass rounded-3xl p-8 border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-4 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="text-sm font-black uppercase tracking-widest">Danger Zone</h4>
                  </div>
                  <p className="text-slate-500 text-sm mb-6 max-w-xl">Termination will result in permanent loss of all credits, order history, and neural wishlist data. This action is irreversible once the uplink is severed.</p>
                  <button 
                    onClick={confirmAccountDeletion}
                    className="px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-xs font-black transition-all uppercase tracking-widest"
                  >
                    Terminate Identity Protocol
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOrderConfirmation = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in zoom-in duration-500">
      <div className="glass rounded-[3rem] p-12 border border-white/10 text-center max-w-lg shadow-2xl">
        <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce"><CheckCircle2 className="w-12 h-12 text-cyan-400" /></div>
        <h1 className="text-4xl font-black mb-4">Transmission Success</h1>
        <p className="text-slate-400 mb-8">Your order has been encoded into the blockchain. Reference: #{orders[0]?.id.toUpperCase()}</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => setView('profile')} className="w-full py-4 glass border border-white/10 hover:bg-white/5 rounded-2xl font-bold transition-all">View Order History</button>
          <button onClick={() => setView('home')} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all">Return to Nexus</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar 
        currentView={view} 
        setView={setView} 
        cartCount={cartCount} 
        user={user} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      <main className="pt-10">
        {view === 'home' && renderHome()}
        {view === 'shop' && renderShop()}
        {view === 'cart' && renderCart()}
        {view === 'checkout' && renderCheckout()}
        {view === 'profile' && renderProfile()}
        {view === 'about' && <AboutPage />}
        {view === 'contact' && <ContactPage />}
        {view === 'auth' && <AuthPage onLogin={handleLogin} onClose={() => setView('home')} />}
        {view === 'admin-auth' && <AdminAuthPage onLogin={handleLogin} onClose={() => setView('home')} />}
        {view === 'order-confirmation' && renderOrderConfirmation()}
        {view === 'admin' && user?.isAdmin && <AdminPanel products={products} orders={orders} setProducts={setProducts} updateOrderStatus={updateOrderStatus} />}
      </main>
      <ChatSupport products={products} />
      <ProductModal 
        product={selectedProduct} 
        allProducts={products} 
        user={user} 
        wishlist={wishlist} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart} 
        onSelectProduct={handleProductClick} 
        onToggleWishlist={toggleWishlist} 
      />
      <footer className="glass border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Cpu className="text-cyan-500 w-6 h-6" />
            <span className="text-2xl font-black tracking-tighter gradient-text">PRIMERSTORE</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <button onClick={() => setView('about')} className="hover:text-cyan-400">About</button>
            <button onClick={() => setView('contact')} className="hover:text-cyan-400">Contact</button>
            <button 
              onClick={() => setView('admin-auth')}
              className="hover:text-purple-400 transition-colors flex items-center gap-1.5 opacity-40 hover:opacity-100"
            >
              <Lock className="w-3 h-3" /> Admin Uplink
            </button>
          </div>
          <p className="text-xs text-slate-600 font-bold">© 2077 PRIMER CORP. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
