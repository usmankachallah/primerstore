
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, Clock, Package, 
  DollarSign, TrendingUp, Target, ShoppingBag, 
  Layers, Activity, Zap, Users, Search, ChevronRight, User, Shield, Star,
  Plus, Edit3, Trash2, X, Save, Image as ImageIcon, Tag, Eye, Navigation, MapPin, Truck, AlertCircle, History, Terminal, Info,
  Cpu, Phone, Settings2, PlusCircle, MinusCircle, Layout, MessageCircle, AlertTriangle, FileText, Send, Share2, Filter
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductVariant, ProductVariantOption, SupportTicket, TicketStatus, User as UserType } from '../types';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  tickets: SupportTicket[];
  user: UserType | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  assignTicket: (ticketId: string, adminName: string) => void;
  deleteTicket: (ticketId: string) => void;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b'];

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, tickets, user, setProducts, updateOrderStatus, deleteOrder, updateTicketStatus, assignTicket, deleteTicket }) => {
  const [tab, setTab] = useState<'orders' | 'stats' | 'citizens' | 'inventory' | 'tickets'>('stats');
  const [citizenSearch, setCitizenSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('All');
  
  // State for Product Editing/Adding
  const [isEditing, setIsEditing] = useState<string | 'new' | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  // State for Details/Tracking
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);
  const [showManifest, setShowManifest] = useState(false);

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

  const orderStats = useMemo(() => {
    return {
      active: orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length,
      escrow: orders.filter(o => o.status === OrderStatus.PENDING).reduce((acc, o) => acc + o.total, 0),
      pendingSyncs: orders.filter(o => o.status === OrderStatus.PENDING).length
    };
  }, [orders]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.id.toLowerCase().includes(ticketSearch.toLowerCase()) || 
                           t.customerName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                           t.subject.toLowerCase().includes(ticketSearch.toLowerCase());
      const matchesStatus = ticketStatusFilter === 'All' || t.status === ticketStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, ticketSearch, ticketStatusFilter]);

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
      setEditFormData({ 
        name: '', 
        price: 0, 
        stock: 0, 
        category: 'Computing', 
        description: '', 
        image: '',
        variants: []
      });
      setIsEditing('new');
    } else {
      setEditFormData({ ...product, variants: product.variants || [] });
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

  const handleDeleteTicket = (id: string) => {
    if (window.confirm("Purge incident log from archive? This action cannot be undone.")) {
      deleteTicket(id);
      if (viewingTicket?.id === id) setViewingTicket(null);
    }
  };

  const handleNeuralPing = (order: Order) => {
    alert(`Neural Ping broadcasted to ${order.customerName}. Transmission synchronized.`);
  };

  // --- Variant Handlers ---
  const addVariant = () => {
    const newVariant: ProductVariant = {
      name: 'New Variant',
      options: []
    };
    setEditFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant]
    }));
  };

  const updateVariantName = (vIdx: number, name: string) => {
    setEditFormData(prev => {
      const variants = [...(prev.variants || [])];
      variants[vIdx] = { ...variants[vIdx], name };
      return { ...prev, variants };
    });
  };

  const removeVariant = (vIdx: number) => {
    setEditFormData(prev => {
      const variants = prev.variants?.filter((_, idx) => idx !== vIdx);
      return { ...prev, variants };
    });
  };

  const addOption = (vIdx: number) => {
    setEditFormData(prev => {
      const variants = [...(prev.variants || [])];
      const newOption: ProductVariantOption = {
        id: Math.random().toString(36).substr(2, 6),
        name: 'New Option',
        priceModifier: 0,
        stockModifier: 0
      };
      variants[vIdx] = {
        ...variants[vIdx],
        options: [...variants[vIdx].options, newOption]
      };
      return { ...prev, variants };
    });
  };

  const updateOption = (vIdx: number, oIdx: number, field: keyof ProductVariantOption, value: any) => {
    setEditFormData(prev => {
      const variants = [...(prev.variants || [])];
      const options = [...variants[vIdx].options];
      options[oIdx] = { ...options[oIdx], [field]: value };
      variants[vIdx] = { ...variants[vIdx], options };
      return { ...prev, variants };
    });
  };

  const removeOption = (vIdx: number, oIdx: number) => {
    setEditFormData(prev => {
      const variants = [...(prev.variants || [])];
      const options = variants[vIdx].options.filter((_, idx) => idx !== oIdx);
      variants[vIdx] = { ...variants[vIdx], options };
      return { ...prev, variants };
    });
  };

  // Tracking Simulation Data (Generates a fake history based on order status)
  const getLogisticsHistory = (order: Order) => {
    const history = [
      { event: 'Transmission Link Established', time: 'T-04:00', icon: <Terminal className="w-3 h-3" /> },
      { event: 'Credit Verification Successful', time: 'T-03:45', icon: <DollarSign className="w-3 h-3" /> },
      { event: 'Inventory Node Locked', time: 'T-03:30', icon: <Package className="w-3 h-3" /> }
    ];
    
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CANCELLED) {
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
          {['stats', 'inventory', 'orders', 'citizens', 'tickets'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab === t ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {t === 'stats' ? 'Analytics' : t === 'orders' ? 'Transmissions' : t === 'tickets' ? 'Incidents' : t}
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Order Summary Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/10 flex items-center gap-4 bg-cyan-500/5">
              <div className="p-3 bg-cyan-500/20 rounded-2xl">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Grid Pings</p>
                <p className="text-2xl font-black">{orderStats.active}</p>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/10 flex items-center gap-4 bg-purple-500/5">
              <div className="p-3 bg-purple-500/20 rounded-2xl">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Escrow Credits</p>
                <p className="text-2xl font-black">${orderStats.escrow.toLocaleString()}</p>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/10 flex items-center gap-4 bg-yellow-500/5">
              <div className="p-3 bg-yellow-500/20 rounded-2xl">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Syncs</p>
                <p className="text-2xl font-black">{orderStats.pendingSyncs}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search transmission ID or citizen name..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                className="bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Nodes</option>
                {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(o => (
                  <div 
                    key={o.id} 
                    onClick={() => setViewingOrder(o)}
                    className={`glass p-6 rounded-3xl border transition-all cursor-pointer group hover:border-cyan-500/30 ${viewingOrder?.id === o.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`p-3 rounded-2xl ${o.status === OrderStatus.DELIVERED ? 'bg-green-500/10' : 'bg-cyan-500/10'}`}>
                          <Package className={`w-5 h-5 ${o.status === OrderStatus.DELIVERED ? 'text-green-400' : 'text-cyan-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-cyan-400 font-bold mb-0.5 text-xs">#{o.id.toUpperCase()}</p>
                            {o.status === OrderStatus.PENDING && (
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" title="High Priority Sync" />
                            )}
                          </div>
                          <p className="text-sm font-black text-white">{o.customerName}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">{o.date} • {o.items.length} Modules</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white mb-1">${o.total}</p>
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                          o.status === OrderStatus.DELIVERED ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          o.status === OrderStatus.PENDING ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          o.status === OrderStatus.CANCELLED ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass p-12 text-center rounded-[3rem] border border-white/10 opacity-50">
                  <Search className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">No transmissions found in sector grid.</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {viewingOrder ? (
                <div className="glass p-8 rounded-[3rem] border border-cyan-500/20 space-y-8 sticky top-32 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                      <Terminal className="text-cyan-400 w-5 h-5" /> Mission Control
                    </h3>
                    <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleNeuralPing(viewingOrder)}
                      className="p-4 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                    >
                      <Send className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Neural Ping</span>
                    </button>
                    <button 
                      onClick={() => setShowManifest(true)}
                      className="p-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                    >
                      <FileText className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">View Manifest</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Settings2 className="w-3 h-3" /> Override Protocol
                    </label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all text-xs font-black uppercase tracking-widest"
                      value={viewingOrder.status}
                      onChange={(e) => updateOrderStatus(viewingOrder.id, e.target.value as OrderStatus)}
                    >
                      {Object.values(OrderStatus).map(s => <option key={s} value={s} className="bg-[#020617]">{s}</option>)}
                    </select>
                  </div>

                  {/* Itemized Payload List */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Layers className="w-3 h-3" /> Payload Contents
                    </label>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
                      {viewingOrder.items.map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase">{item.name}</p>
                            <p className="text-[10px] font-black text-slate-400">x{item.quantity}</p>
                          </div>
                          {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.selectedVariants).map(([k, v]) => (
                                <span key={k} className="text-[8px] font-black uppercase text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                  {k}: {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 relative pt-4 border-t border-white/5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <History className="w-3 h-3" /> Grid Telemetry
                    </label>
                    <div className="space-y-6 relative ml-2">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/5" />
                      {getLogisticsHistory(viewingOrder).map((log, i) => (
                        <div key={i} className="flex gap-6 relative z-10 group">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 ${i === 0 ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900 text-slate-600'}`}>
                            {log.icon}
                          </div>
                          <div>
                            <p className={`text-[10px] font-black ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{log.event}</p>
                            <p className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-widest mt-1">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Deployment Node</span>
                    </div>
                    <p className="text-xs font-bold leading-relaxed text-slate-300">{viewingOrder.address}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <Phone className="w-3 h-3 text-slate-600" />
                      <span className="text-[10px] font-mono text-slate-500">{viewingOrder.phone}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteOrder(viewingOrder.id)}
                    className="w-full py-4 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                  >
                    <Trash2 className="w-4 h-4" /> Decommission Order
                  </button>
                </div>
              ) : (
                <div className="glass p-12 text-center rounded-[3rem] border border-white/10 border-dashed h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                  <Navigation className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Select transmission to monitor telemetry</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manifest Overlay */}
      {showManifest && viewingOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowManifest(false)} />
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-[2rem] p-10 shadow-2xl overflow-hidden font-mono">
            {/* Manifest Design Elements */}
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <Zap className="w-40 h-40 text-black rotate-12" />
            </div>
            
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">PRIMER CORP.</h2>
                <p className="text-[10px] font-black uppercase">Hardware Deployment Division • Sector 07 Hub</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase">Transmission ID</p>
                <p className="text-lg font-black">#{viewingOrder.id.toUpperCase()}</p>
                <p className="text-[10px] font-bold text-slate-500">{viewingOrder.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <h4 className="text-[10px] font-black border-b border-slate-900 mb-2 uppercase">Authorized Citizen</h4>
                <p className="font-bold text-sm">{viewingOrder.customerName}</p>
                <p className="text-xs text-slate-600">{viewingOrder.phone}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black border-b border-slate-900 mb-2 uppercase">Deployment Destination</h4>
                <p className="text-xs font-bold leading-relaxed">{viewingOrder.address}</p>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-[10px] font-black border-b border-slate-900 mb-4 uppercase">Module Manifest</h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2">SKU / Designation</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-3">
                        <p className="font-bold uppercase">{item.name}</p>
                        {item.selectedVariants && (
                          <p className="text-[9px] text-slate-500 italic">
                            {Object.entries(item.selectedVariants).map(([k,v]) => `${k}:${v}`).join(' | ')}
                          </p>
                        )}
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right font-bold">${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-8 border-t-2 border-slate-900">
              <div className="flex gap-4">
                <div className="p-2 border border-slate-200 rounded">
                   <Activity className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                   <p className="text-[8px] font-black uppercase">Ledger Status</p>
                   <p className="text-[10px] font-bold text-green-600">FULLY AUTHENTICATED</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase">Total Authorized Credits</p>
                <p className="text-3xl font-black">${viewingOrder.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-10 flex justify-between gap-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                <ImageIcon className="w-4 h-4" /> Download Node Copy
              </button>
              <button 
                onClick={() => setShowManifest(false)}
                className="px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Abort View
              </button>
            </div>
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
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citizens.map(c => {
              const tier = getTier(c.totalSpent);
              return (
                <div key={c.phone || c.name} className="glass p-6 rounded-3xl border border-white/10 relative group overflow-hidden">
                  <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 flex items-center justify-center transform rotate-12 transition-transform group-hover:scale-125`}>
                    <User className="w-12 h-12" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{c.name}</h3>
                  <p className="text-[10px] font-mono text-slate-500 mb-4">{c.phone}</p>
                  <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded mb-6 w-fit ${tier.bg} ${tier.color} ${tier.border}`}>
                    {tier.name} Tier
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="text-center flex-1 border-r border-white/5">
                      <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Spent</p>
                      <p className="font-black text-white">${c.totalSpent}</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Orders</p>
                      <p className="font-black text-white">{c.orderCount}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'tickets' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search Incident ID, subject, or citizen..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase text-slate-500 whitespace-nowrap">Filter Status:</span>
              <select 
                className="bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500"
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
              >
                <option value="All">All Incidents</option>
                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredTickets.length > 0 ? (
                filteredTickets.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setViewingTicket(t)}
                    className={`glass p-6 rounded-3xl border transition-all cursor-pointer group hover:border-cyan-500/30 ${viewingTicket?.id === t.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`p-3 rounded-2xl ${
                          t.urgency === 'Critical' ? 'bg-rose-500/10' :
                          t.urgency === 'Standard' ? 'bg-cyan-500/10' :
                          'bg-slate-500/10'
                        }`}>
                          <AlertCircle className={`w-5 h-5 ${
                            t.urgency === 'Critical' ? 'text-rose-400' :
                            t.urgency === 'Standard' ? 'text-cyan-400' :
                            'text-slate-400'
                          }`} />
                        </div>
                        <div>
                          <p className="font-mono text-cyan-400 font-bold mb-0.5">#{t.id.toUpperCase()}</p>
                          <p className="text-sm font-black text-white">{t.subject}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">{t.customerName} • {t.type} • {t.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                          t.status === TicketStatus.RESOLVED ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          t.status === TicketStatus.OPEN ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          t.status === TicketStatus.CLOSED ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                          'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        }`}>
                          {t.status}
                        </span>
                        {t.assignedTo && (
                          <p className="text-[8px] font-black text-slate-600 uppercase mt-2">Assigned: {t.assignedTo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass p-12 text-center rounded-[3rem] border border-white/10 opacity-50">
                  <MessageCircle className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">No incident reports detected in the grid.</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {viewingTicket ? (
                <div className="glass p-8 rounded-[3rem] border border-cyan-500/20 space-y-8 sticky top-32 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black flex items-center gap-3">
                      <Terminal className="text-cyan-400 w-5 h-5" /> Incident Log
                    </h3>
                    <button onClick={() => setViewingTicket(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-4 h-4 text-slate-500" /></button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Citizen Payload</label>
                      <p className="text-sm font-bold text-white mt-1">{viewingTicket.customerName}</p>
                      <p className="text-[10px] font-mono text-slate-500">{viewingTicket.customerId}</p>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transmission Subject</label>
                      <p className="text-sm font-bold text-white mt-1">{viewingTicket.subject}</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Buffer Description</label>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{viewingTicket.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Urgency</label>
                        <p className={`text-xs font-black uppercase mt-1 ${viewingTicket.urgency === 'Critical' ? 'text-rose-400' : 'text-cyan-400'}`}>{viewingTicket.urgency}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector</label>
                        <p className="text-xs font-black uppercase text-white mt-1">{viewingTicket.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Override Status</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all text-xs font-black uppercase tracking-widest"
                        value={viewingTicket.status}
                        onChange={(e) => updateTicketStatus(viewingTicket.id, e.target.value as TicketStatus)}
                      >
                        {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {!viewingTicket.assignedTo ? (
                      <button 
                        onClick={() => assignTicket(viewingTicket.id, user?.name || 'Administrator')}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3"
                      >
                        <User className="w-4 h-4" /> Assume Ownership
                      </button>
                    ) : (
                      <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center gap-3">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-[8px] font-black text-purple-400 uppercase">Assigned To</p>
                          <p className="text-[11px] font-black text-white">{viewingTicket.assignedTo}</p>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => updateTicketStatus(viewingTicket.id, TicketStatus.RESOLVED)}
                      className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-3"
                    >
                      <CheckCircle className="w-4 h-4" /> Finalize Resolution
                    </button>

                    <button 
                      onClick={() => handleDeleteTicket(viewingTicket.id)}
                      className="w-full py-3 text-rose-500 hover:text-white hover:bg-rose-500 transition-all rounded-2xl text-[9px] font-black uppercase tracking-widest border border-rose-500/30 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Purge Log
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass p-12 text-center rounded-[3rem] border border-white/10 border-dashed h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                  <AlertTriangle className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Select incident to begin triage</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Edit/New Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditing(null)} />
          <div className="relative w-full max-w-4xl glass rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {isEditing === 'new' ? 'Initialize Unit' : 'Modify Configuration'}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide space-y-10">
              {/* Primary Attributes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><DollarSign className="w-3 h-3" /> Base Price</label>
                      <input 
                        type="number" 
                        value={editFormData.price}
                        onChange={(e) => setEditFormData({...editFormData, price: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Package className="w-3 h-3" /> Base Stock</label>
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
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Terminal className="w-3 h-3" /> Description Buffer</label>
                    <textarea 
                      rows={4}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-cyan-500 transition-all text-xs leading-relaxed font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Hardware Variant Architect */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <Layout className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Hardware Variant Architect</h3>
                  </div>
                  <button 
                    onClick={addVariant}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-500/30"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Component Layer
                  </button>
                </div>

                <div className="space-y-8">
                  {editFormData.variants?.map((v, vIdx) => (
                    <div key={vIdx} className="glass p-6 rounded-[2rem] border border-white/5 space-y-6 relative group/v">
                      <button 
                        onClick={() => removeVariant(vIdx)}
                        className="absolute top-6 right-6 p-2 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover/v:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="max-w-xs space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Variant Designation</label>
                        <input 
                          type="text" 
                          value={v.name}
                          onChange={(e) => updateVariantName(vIdx, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-purple-500 text-xs font-bold"
                          placeholder="e.g. Color, Chassis, Sync Speed"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 px-2">
                          <span className="text-[8px] font-black uppercase text-slate-500">Option Designation</span>
                          <span className="text-[8px] font-black uppercase text-slate-500 text-center">Credit Delta</span>
                          <span className="text-[8px] font-black uppercase text-slate-500 text-center">Stock Delta</span>
                          <span className="text-[8px] font-black uppercase text-slate-500 text-right">Actions</span>
                        </div>

                        <div className="space-y-3">
                          {v.options.map((opt, oIdx) => (
                            <div key={opt.id} className="grid grid-cols-4 gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/5 group/opt">
                              <input 
                                type="text"
                                value={opt.name}
                                onChange={(e) => updateOption(vIdx, oIdx, 'name', e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-xs font-bold text-white placeholder:text-slate-700"
                                placeholder="Option name"
                              />
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-[9px] font-black text-cyan-400">$</span>
                                <input 
                                  type="number"
                                  value={opt.priceModifier}
                                  onChange={(e) => updateOption(vIdx, oIdx, 'priceModifier', Number(e.target.value))}
                                  className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-[10px] font-mono text-cyan-400 focus:border-cyan-500"
                                />
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-[9px] font-black text-rose-400">±</span>
                                <input 
                                  type="number"
                                  value={opt.stockModifier}
                                  onChange={(e) => updateOption(vIdx, oIdx, 'stockModifier', Number(e.target.value))}
                                  className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-[10px] font-mono text-rose-400 focus:border-rose-500"
                                />
                              </div>
                              <div className="flex justify-end">
                                <button onClick={() => removeOption(vIdx, oIdx)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                                  <MinusCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => addOption(vIdx)}
                            className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[9px] font-black text-slate-600 hover:text-purple-400 hover:border-purple-500/50 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                          >
                            <Plus className="w-3 h-3" /> Add Component Option
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!editFormData.variants || editFormData.variants.length === 0) && (
                    <div className="text-center py-10 glass rounded-[2.5rem] border border-white/10 border-dashed opacity-50">
                      <Layout className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No hardware variants defined for this unit</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 shrink-0 mt-8">
              <button 
                onClick={handleSaveProduct}
                className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 active:scale-95"
              >
                <Save className="w-5 h-5" />
                Authorize Configuration Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
