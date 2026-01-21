
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ChatSupport from './components/ChatSupport';
import AdminPanel from './components/AdminPanel';
import ProductModal from './components/ProductModal';
import AuthPage from './components/AuthPage';
import AdminAuthPage from './components/AdminAuthPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import SettingsPage from './components/SettingsPage';
import ServicesPage from './components/ServicesPage';
import FAQPage from './components/FAQPage';
import SupportTicketPage from './components/SupportTicketPage';
import RoadmapPage from './components/RoadmapPage';
import SyncTermsPage from './components/SyncTermsPage';
import BiometricPolicyPage from './components/BiometricPolicyPage';
import Newsletter from './components/Newsletter';
import { Product, CartItem, Order, OrderStatus, View, User } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './constants';
import { 
  ShoppingBag, ArrowRight, Star, ArrowLeft, CreditCard, 
  CheckCircle2, Search, Filter, Package, Cpu, 
  User as UserIcon, Settings, Heart, LayoutDashboard, 
  History, Shield, ShieldCheck, MapPin, Phone, Mail, Trash2, Zap, DollarSign, LogOut, Lock,
  Wallet, Fingerprint, Activity, Key, Eye, EyeOff, AlertTriangle, Plus, Edit3, TrendingUp,
  Globe, Github, Twitter, Linkedin, ExternalLink, Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  // --- Redirect Logic ---
  useEffect(() => {
    if (user && view === 'home') {
      setView(user.isAdmin ? 'admin' : 'shop');
    }
    if (!user && view === 'settings') {
      setView('auth');
    }
    if (user?.isAdmin && (view === 'shop' || view === 'cart' || view === 'checkout' || view === 'services')) {
      setView('admin');
    }
  }, [user, view]);

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

  const newArrivals = useMemo(() => {
    return products.filter(p => p.isNew).slice(0, 4);
  }, [products]);

  const totalSpent = useMemo(() => {
    return orders.reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const citizenTier = useMemo(() => {
    if (totalSpent > 5000) return { name: 'Ethereal', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
    if (totalSpent > 2000) return { name: 'Vanguard', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    if (totalSpent > 500) return { name: 'Citizen', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    return { name: 'Initiate', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
  }, [totalSpent]);

  const spendingData = useMemo(() => {
    return orders.slice(0, 7).reverse().map((o, i) => ({
      name: `T-${orders.length - i}`,
      credits: o.total
    }));
  }, [orders]);

  // --- Handlers ---
  const handleLogin = (userData: any) => {
    const userWithAddresses: User = {
      ...userData,
      savedAddresses: userData.savedAddresses || [userData.address || 'Neo-Tokyo Sector 4']
    };
    setUser(userWithAddresses);
    setView(userWithAddresses.isAdmin ? 'admin' : 'shop');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const addToCart = (product: Product, quantity: number = 1, selectedVariants?: Record<string, string>) => {
    setCart(prev => {
      let finalPrice = product.price;
      if (selectedVariants && product.variants) {
        product.variants.forEach(v => {
          const optId = selectedVariants[v.name];
          const option = v.options.find(o => o.id === optId);
          if (option) finalPrice += (option.priceModifier || 0);
        });
      }

      const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : '';
      const existing = prev.find(item => item.id === product.id && JSON.stringify(item.selectedVariants) === variantKey);
      
      if (existing) {
        return prev.map(item => (item.id === product.id && JSON.stringify(item.selectedVariants) === variantKey) 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { ...product, price: finalPrice, quantity, selectedVariants }];
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

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleProductClick = (p: Product) => {
    setSelectedProduct(p);
  };

  const updateProfileData = (field: keyof User, value: any) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  const renderHome = () => {
    if (user) return null;
    return (
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
              <button onClick={() => setView('roadmap')} className="px-8 py-4 glass hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10">
                View Roadmap
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Latest Iterations</span>
              </div>
              <h2 className="text-4xl font-black">NEURAL DROPS</h2>
            </div>
            <button onClick={() => setView('shop')} className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
              Browse History <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(p => (
              <div 
                key={p.id} 
                className="group relative glass rounded-[2rem] p-4 border border-white/10 transition-all hover:-translate-y-2 hover:border-cyan-500/50 cursor-pointer overflow-hidden"
                onClick={() => handleProductClick(p)}
              >
                <div className="absolute top-6 left-6 z-10">
                   <div className="bg-cyan-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-pulse uppercase tracking-widest">
                     NEW
                   </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                  <img src={p.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={p.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="relative">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight truncate">{p.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-black tracking-tighter">${p.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      className="p-3 bg-white/5 hover:bg-cyan-600 rounded-xl transition-all group/btn"
                    >
                      <Plus className="w-5 h-5 text-slate-400 group-hover/btn:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Newsletter />
      </div>
    );
  };

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
              {p.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-cyan-500 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase shadow-lg">NEW</div>
              )}
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
              <div key={item.id + JSON.stringify(item.selectedVariants)} className="glass rounded-2xl p-4 border border-white/10 flex items-center gap-6">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} />
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  {item.selectedVariants && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(item.selectedVariants).map(([k, v]) => {
                        const opt = item.variants?.find(variant => variant.name === k)?.options.find(o => o.id === v);
                        return (
                          <span key={k} className="text-[9px] font-black uppercase tracking-tighter bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">
                            {k}: {opt?.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1">${item.price}</p>
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
          
          <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <UserIcon className="w-3.5 h-3.5" /> Deployment Parameters
            </h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" />
              <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Coordinates Source</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 mb-2"
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  value={formData.address}
                >
                  <option value="">Custom Coordinates...</option>
                  {user?.savedAddresses.map((addr, idx) => (
                    <option key={idx} value={addr}>{addr}</option>
                  ))}
                </select>
                <textarea 
                  placeholder="Delivery Coordinates" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600" 
                  rows={3} 
                />
              </div>
            </div>
          </div>

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
                <div key={item.id + JSON.stringify(item.selectedVariants)} className="flex justify-between items-center text-sm">
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
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 space-y-4">
            <div className="glass rounded-3xl p-6 border border-white/10 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500/20 mx-auto">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-full h-full object-cover" alt="Profile avatar" />
                </div>
              </div>
              <h2 className="text-xl font-black">{user?.name}</h2>
              <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${citizenTier.bg} ${citizenTier.color} ${citizenTier.border}`}>
                {citizenTier.name} Tier
              </div>
              <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-tighter font-bold">Citizen Unit #{user?.id.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="glass rounded-3xl p-2 border border-white/10 flex flex-col">
              <button onClick={() => setProfileTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${profileTab === 'overview' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <LayoutDashboard className="w-4 h-4" /> Neural Overview
              </button>
              <button onClick={() => setProfileTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${profileTab === 'orders' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <History className="w-4 h-4" /> Order Ledger
              </button>
              <button onClick={() => setProfileTab('wishlist')} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${profileTab === 'wishlist' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Heart className="w-4 h-4" /> Memory Bank
              </button>
              <button onClick={() => setView('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-slate-400 hover:text-white hover:bg-white/5`}>
                <SettingsIcon className="w-4 h-4" /> System Parameters
              </button>
            </div>

            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-3xl text-sm font-black border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all uppercase tracking-widest">
              <LogOut className="w-4 h-4" /> Sever Uplink
            </button>

            {user?.isAdmin && (
              <button onClick={() => setView('admin')} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-3xl text-sm font-black border border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 transition-all uppercase tracking-widest">
                <Shield className="w-4 h-4" /> Enter Command Center
              </button>
            )}
          </div>

          <div className="lg:w-3/4">
            {profileTab === 'overview' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                    <Zap className="w-8 h-8 text-cyan-400 mb-4" />
                    <p className="text-3xl font-black mb-1">{orders.length}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Successful Transmissions</p>
                  </div>
                  <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                    <DollarSign className="w-8 h-8 text-purple-400 mb-4" />
                    <p className="text-3xl font-black mb-1">${totalSpent}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Credits Invested</p>
                  </div>
                  <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                    <Heart className="w-8 h-8 text-rose-400 mb-4" />
                    <p className="text-3xl font-black mb-1">{wishlist.length}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Memory Bank Items</p>
                  </div>
                </div>

                <div className="glass rounded-[2.5rem] p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black flex items-center gap-2">
                      <TrendingUp className="text-cyan-400 w-5 h-5" /> Spending Trajectory
                    </h3>
                  </div>
                  <div className="h-[200px] w-full">
                    {orders.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={spendingData}>
                          <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                          <YAxis hide />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                          <Area type="monotone" dataKey="credits" stroke="#22d3ee" strokeWidth={3} fill="#22d3ee" fillOpacity={0.1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-slate-600 font-bold text-xs">
                        Awaiting initial transmissions for trajectory mapping...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {profileTab === 'orders' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-black">Transmission Archive</h3>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(o => (
                      <div key={o.id} className="glass rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div>
                            <p className="font-mono text-cyan-400 text-lg mb-1">#{o.id.toUpperCase()}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{o.date} • {o.items.length} Modules</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 ${
                              o.status === OrderStatus.DELIVERED ? 'bg-green-500/20 text-green-400' :
                              o.status === OrderStatus.PENDING ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-cyan-500/20 text-cyan-400'
                            }`}>
                              {o.status}
                            </span>
                            <p className="text-xl font-black">${o.total}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-[3rem] p-16 text-center border border-white/10">
                    <History className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                    <p className="text-slate-500 mb-8">The archive is vacant. No telemetry found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const renderOrderConfirmation = () => {
    const lastOrder = orders[0];
    if (!lastOrder) return null;
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="text-5xl font-black mb-4 uppercase">Uplink Successful</h1>
        <p className="text-slate-400 text-lg mb-12 font-medium">Transmission ID: <span className="text-cyan-400 font-mono">#{lastOrder.id.toUpperCase()}</span> has been broadcast to the distribution grid.</p>
        <button onClick={() => setView('shop')} className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest text-xs">Return to Catalog</button>
      </div>
    );
  };

  const isAdmin = user?.isAdmin;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar currentView={view} setView={setView} cartCount={cartCount} user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="pt-10">
        {view === 'home' && renderHome()}
        {view === 'shop' && renderShop()}
        {view === 'cart' && renderCart()}
        {view === 'checkout' && renderCheckout()}
        {view === 'profile' && renderProfile()}
        {view === 'settings' && user && <SettingsPage user={user} onUpdateUser={updateProfileData} />}
        {view === 'services' && <ServicesPage />}
        {view === 'about' && <AboutPage />}
        {view === 'contact' && <ContactPage />}
        {view === 'faq' && <FAQPage setView={setView} />}
        {view === 'support-ticket' && <SupportTicketPage setView={setView} />}
        {view === 'roadmap' && <RoadmapPage />}
        {view === 'sync-terms' && <SyncTermsPage setView={setView} />}
        {view === 'biometric-policy' && <BiometricPolicyPage setView={setView} />}
        {view === 'auth' && <AuthPage onLogin={handleLogin} onClose={() => setView('home')} />}
        {view === 'admin-auth' && <AdminAuthPage onLogin={handleLogin} onClose={() => setView('home')} />}
        {view === 'order-confirmation' && renderOrderConfirmation()}
        {view === 'admin' && user?.isAdmin && <AdminPanel products={products} orders={orders} setProducts={setProducts} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} />}
      </main>
      {!isAdmin && <ChatSupport products={products} />}
      <ProductModal product={selectedProduct} allProducts={products} user={user} wishlist={wishlist} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} onSelectProduct={handleProductClick} onToggleWishlist={toggleWishlist} />
      <footer className="glass border-t border-white/10 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-cyan-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Cpu className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter gradient-text">PRIMERSTORE</span>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">© 2077 PRIMER CORP. • DESIGNED IN NEO-TOKYO • ALL DATA ENCRYPTED</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
