
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, Clock, Package, 
  DollarSign, TrendingUp, Target, ShoppingBag, 
  Layers, Activity, Zap, Users, Search, ChevronRight, User, Shield, Star,
  Plus, Edit3, Trash2, X, Save, Image as ImageIcon, Tag, Eye, Navigation, MapPin, Truck, AlertCircle, History, Terminal, Info,
  Cpu // Added Cpu to lucide-react imports
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
  deleteOrder: (orderId: string) => void;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b'];

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, setProducts, updateOrderStatus, deleteOrder }) => {
  const [tab, setTab] = useState<'orders' | 'stats' | 'citizens' | 'inventory'>('stats');
  const [citizenSearch, setCitizenSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // State for Product Editing/Adding
  const [isEditing, setIsEditing] = useState<string | 'new' | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  // State for Order Details/Tracking
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

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

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                           o.customerName.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, statusFilter]);

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

  const handleDeleteOrder = (id: string) => {
    if (window.confirm("Sever the transmission permanently? This action is irreversible.")) {
      deleteOrder(id);
      if (viewingOrder?.id === id) setViewingOrder(null);
    }
  };

  // Tracking Simulation Data (Generates a fake history based on order status)
  const getLogisticsHistory = (order: Order) => {
    const history = [
      { event: 'Transmission Link Established', time: 'T-04:00', icon: <Terminal className="w-3 h-3" /> },
      { event: 'Credit Verification Successful', time: 'T-03:45', icon: <DollarSign className="w-3 h-3" /> },
      { event: 'Inventory Node Locked', time: 'T-03:30', icon: <Package className="w-3 h-3" /> }
    ];
    
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CANCELLED) {
      // Corrected: Cpu icon on line 165 requires the icon import
      history.push({ event: 'Hardware Integration Started', time: 'T-02:00', icon: <Cpu className="w-3 h-3" /> });
    }
    
    if (order.status === OrderStatus.PROCESSING) {
      history.push({ event: 'Sector Hub Routing Active', time: 'Live', icon: <Activity className="w-3 h-3" /> });
    }
    
    if (order.status === OrderStatus.DELIVERED) {
      history.push({ event: 'Dispatch to Final Node', time: 'T-01:00', icon: <Truck className="w-3 h-3" /> });
      history.push({ event: 'Terminal Sync Verified', time: 'Completed', icon: <CheckCircle className="w-3 h-3" /> });
    }

    if (order.status === OrderStatus.CANCELLED) {
      history.push({ event: 'Protocol Breach: Transmission Severed', time: 'Terminated', icon: <AlertCircle className="w-3 h-3" /> });
    }
    
    return history.reverse();
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
          {['stats', 'inventory', 'orders', 'citizens'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab === t ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {t === 'stats' ? 'Analytics' : t === 'orders' ? 'Transmissions' : t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'stats' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Gross Revenue', val: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-cyan-400" />, bg: 'bg-cyan-500/10' },
              { label: 'Avg Order Value', val: `$${avgOrderValue}`, icon: <ShoppingBag className="text-purple-400" />, bg: 'bg-purple-500/10' },
              { label: 'Active Citizens', val: Object.keys(citizens).length, icon: <Users className="text-blue-400" />, bg: 'bg-blue-500/10' },
              { label: 'Uplink Health', val: '99.9%', icon: <Activity className="text-emerald-400" />, bg: 'bg-emerald-500/10' }
            ].map(stat => (
              <div key={stat.label} className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 ${stat.bg} rounded-xl`}>{stat.icon}</div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{stat.label}</span>
                </div>
                <p className="text-3xl font-black">{stat.val}</p>
              </div>
            ))}
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
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
              />
            </div>
            <button 
              onClick={() => handleEditClick('new')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Deploy New Unit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className="glass p-6 rounded-3xl border border-white/10 flex flex-col group relative overflow-hidden">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                  <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={p.name} />
                </div>
                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest">{p.category}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-black">${p.price}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(p)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {p.stock < 10 && <div className="absolute top-4 left-4 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg animate-pulse uppercase">Low Stock</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map(o => (
              <div key={o.id} className="glass p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-mono text-cyan-400 font-bold">#{o.id.toUpperCase()}</p>
                  <p className="text-sm font-bold">{o.customerName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{o.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg">${o.total}</p>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                    o.status === OrderStatus.DELIVERED ? 'bg-green-500/20 text-green-400' :
                    o.status === OrderStatus.PENDING ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'citizens' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citizens.map(c => {
              const tier = getTier(c.totalSpent);
              return (
                <div key={c.phone || c.name} className="glass p-6 rounded-3xl border border-white/10">
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{c.phone}</p>
                  <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded mb-4 w-fit ${tier.bg} ${tier.color} ${tier.border}`}>
                    {tier.name} Tier
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase">Spent</span>
                    <span className="font-black text-cyan-400">${c.totalSpent}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed: Added default export for AdminPanel
export default AdminPanel;
