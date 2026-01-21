
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, Clock, Package, 
  DollarSign, TrendingUp, Target, ShoppingBag, 
  Layers, Activity, Zap, Users, Search, ChevronRight, User, Shield, Star,
  Plus, Edit3, Trash2, X, Save, Image as ImageIcon, Tag
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b'];

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, setProducts, updateOrderStatus }) => {
  const [tab, setTab] = useState<'orders' | 'stats' | 'citizens' | 'inventory'>('stats');
  const [citizenSearch, setCitizenSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  
  // State for Product Editing/Adding
  const [isEditing, setIsEditing] = useState<string | 'new' | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  // --- Calculations ---
  const totalRevenue = useMemo(() => orders.reduce((acc, curr) => acc + curr.total, 0), [orders]);
  
  const avgOrderValue = useMemo(() => 
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
  , [totalRevenue, orders]);

  const salesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + (item.price * item.quantity);
      });
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Derive unique citizens from orders
  const citizens = useMemo(() => {
    const customerMap: Record<string, { 
      name: string, 
      phone: string, 
      totalSpent: number, 
      orderCount: number, 
      lastOrder: string 
    }> = {};

    orders.forEach(order => {
      const key = order.phone || order.customerName;
      if (!customerMap[key]) {
        customerMap[key] = {
          name: order.customerName,
          phone: order.phone,
          totalSpent: 0,
          orderCount: 0,
          lastOrder: order.date
        };
      }
      customerMap[key].totalSpent += order.total;
      customerMap[key].orderCount += 1;
      if (new Date(order.date) > new Date(customerMap[key].lastOrder)) {
        customerMap[key].lastOrder = order.date;
      }
    });

    return Object.values(customerMap).filter(c => 
      c.name.toLowerCase().includes(citizenSearch.toLowerCase()) || 
      c.phone.includes(citizenSearch)
    );
  }, [orders, citizenSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const getTier = (spent: number) => {
    if (spent > 5000) return { name: 'Ethereal', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
    if (spent > 2000) return { name: 'Vanguard', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    if (spent > 500) return { name: 'Citizen', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    return { name: 'Initiate', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
  };

  const revenueTrend = [
    { name: 'Jan', rev: 4500 },
    { name: 'Feb', rev: 5200 },
    { name: 'Mar', rev: 4800 },
    { name: 'Apr', rev: 6100 },
    { name: 'May', rev: totalRevenue > 0 ? totalRevenue : 7200 },
  ];

  // --- Handlers ---
  const handleEditClick = (product: Product | 'new') => {
    if (product === 'new') {
      setEditFormData({ name: '', price: 0, stock: 0, category: 'Computing', description: '', image: '' });
      setIsEditing('new');
    } else {
      setEditFormData(product);
      setIsEditing(product.id);
    }
  };

  const handleSaveProduct = () => {
    if (isEditing === 'new') {
      const newProduct: Product = {
        ...editFormData as Product,
        id: Math.random().toString(36).substr(2, 9),
      };
      setProducts(prev => [newProduct, ...prev]);
    } else {
      setProducts(prev => prev.map(p => p.id === isEditing ? { ...p, ...editFormData } : p));
    }
    setIsEditing(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to decommission this unit?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
            <Zap className="text-cyan-400 w-8 h-8" />
            Command Center
          </h1>
          <p className="text-slate-400">Orchestrating the future of retail operations.</p>
        </div>
        <div className="flex glass rounded-2xl p-1 border border-white/10 overflow-x-auto">
          <button 
            onClick={() => setTab('stats')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'stats' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setTab('inventory')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'inventory' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setTab('orders')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'orders' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Transmissions
          </button>
          <button 
            onClick={() => setTab('citizens')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'citizens' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Citizens
          </button>
        </div>
      </div>

      {tab === 'stats' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-cyan-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl"><DollarSign className="text-cyan-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Gross Revenue</span>
              </div>
              <p className="text-3xl font-black">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-purple-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl"><ShoppingBag className="text-purple-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Avg Order Value</span>
              </div>
              <p className="text-3xl font-black">${avgOrderValue}</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-blue-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="text-blue-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Active Citizens</span>
              </div>
              <p className="text-3xl font-black">{Object.keys(citizens).length}</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-rose-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-500/20 rounded-xl"><Activity className="text-rose-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Conversion Rate</span>
              </div>
              <p className="text-3xl font-black">3.8%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-[400px] flex flex-col">
              <h3 className="text-lg font-black flex items-center gap-2 mb-8">
                <TrendingUp className="text-cyan-400 w-4 h-4" /> Revenue Trajectory
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px'}} />
                    <Area type="monotone" dataKey="rev" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-[400px] flex flex-col">
              <h3 className="text-lg font-black flex items-center gap-2 mb-8">
                <Layers className="text-purple-400 w-4 h-4" /> Sector Distribution
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesByCategory} dataKey="value" innerRadius={80} outerRadius={100} paddingAngle={5} stroke="none">
                      {salesByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Locate unit in catalog..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <button 
              onClick={() => handleEditClick('new')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Deploy New Unit
            </button>
          </div>

          <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-8 py-6">Unit Image</th>
                  <th className="px-8 py-6">Designation</th>
                  <th className="px-8 py-6">Classification</th>
                  <th className="px-8 py-6">Current Stock</th>
                  <th className="px-8 py-6">Price Points</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                        <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-white group-hover:text-cyan-400 transition-colors">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">#{p.id.toUpperCase()}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-rose-500 animate-pulse' : 'bg-green-500'}`} />
                        <span className={`font-black ${p.stock < 10 ? 'text-rose-400' : 'text-white'}`}>
                          {p.stock} Units
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-white">${p.price}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-xl transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-8 py-6">Transmission ID</th>
                  <th className="px-8 py-6">Authorized Citizen</th>
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6">Total Credits</th>
                  <th className="px-8 py-6">Sync Status</th>
                  <th className="px-8 py-6 text-right">Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 font-mono text-cyan-400">#{o.id.toUpperCase()}</td>
                    <td className="px-8 py-5">
                      <div className="font-black text-white">{o.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{o.phone}</div>
                    </td>
                    <td className="px-8 py-5 text-slate-400 font-bold">{o.date}</td>
                    <td className="px-8 py-5 font-black text-white">${o.total}</td>
                    <td className="px-8 py-5">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                        o.status === OrderStatus.DELIVERED ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        o.status === OrderStatus.PROCESSING ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          o.status === OrderStatus.DELIVERED ? 'bg-green-400' : 
                          o.status === OrderStatus.PROCESSING ? 'bg-cyan-400' : 'bg-yellow-400'
                        } animate-pulse`} />
                        {o.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <select 
                        className="bg-[#0f172a] border border-white/10 text-[10px] font-black uppercase tracking-tighter rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 text-slate-300"
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      >
                        <option value={OrderStatus.PENDING}>Pending</option>
                        <option value={OrderStatus.PROCESSING}>Processing</option>
                        <option value={OrderStatus.DELIVERED}>Delivered</option>
                        <option value={OrderStatus.CANCELLED}>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'citizens' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative w-full max-w-md mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Lookup Citizen signal..."
              value={citizenSearch}
              onChange={(e) => setCitizenSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-8 py-6">Citizen Core</th>
                  <th className="px-8 py-6">Status Tier</th>
                  <th className="px-8 py-6">Telemetry</th>
                  <th className="px-8 py-6">Investment</th>
                  <th className="px-8 py-6">Last Uplink</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {citizens.map((citizen, idx) => {
                  const tier = getTier(citizen.totalSpent);
                  return (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400"><User className="w-5 h-5" /></div>
                          <div>
                            <div className="font-black text-white">{citizen.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{citizen.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${tier.bg} ${tier.color} ${tier.border}`}>
                          {tier.name}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-400 font-bold">{citizen.orderCount} Transmissions</td>
                      <td className="px-8 py-5 font-black text-white">${citizen.totalSpent.toLocaleString()}</td>
                      <td className="px-8 py-5 text-slate-500 text-[11px] font-medium">{citizen.lastOrder}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Edit/New Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditing(null)} />
          <div className="relative w-full max-w-2xl glass rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {isEditing === 'new' ? 'Initialize Unit' : 'Modify Configuration'}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap className="w-3 h-3" /> Unit Designation</label>
                  <input 
                    type="text" 
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Tag className="w-3 h-3" /> Sector Classification</label>
                  <select 
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-sm font-bold"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Computing">Computing</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><DollarSign className="w-3 h-3" /> Price Points</label>
                    <input 
                      type="number" 
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({...editFormData, price: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Package className="w-3 h-3" /> Unit Stock</label>
                    <input 
                      type="number" 
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({...editFormData, stock: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Visual Asset URL</label>
                  <input 
                    type="text" 
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({...editFormData, image: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3 h-3" /> Description Buffer</label>
                  <textarea 
                    rows={4}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-xs leading-relaxed font-medium"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveProduct}
              className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 active:scale-95"
            >
              <Save className="w-5 h-5" />
              Authorize Configuration Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock FileText for missing icon
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

export default AdminPanel;
