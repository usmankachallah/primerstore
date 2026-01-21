
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, Clock, Package, 
  DollarSign, TrendingUp, Target, ShoppingBag, 
  Layers, Activity, Zap
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

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, updateOrderStatus }) => {
  const [tab, setTab] = useState<'orders' | 'stats'>('stats');

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

  // Mocked trend data for visual impact
  const revenueTrend = [
    { name: 'Jan', rev: 4500, orders: 12 },
    { name: 'Feb', rev: 5200, orders: 15 },
    { name: 'Mar', rev: 4800, orders: 11 },
    { name: 'Apr', rev: 6100, orders: 18 },
    { name: 'May', rev: totalRevenue > 0 ? totalRevenue : 7200, orders: orders.length || 22 },
  ];

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
        <div className="flex glass rounded-2xl p-1 border border-white/10">
          <button 
            onClick={() => setTab('stats')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'stats' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setTab('orders')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'orders' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Transmissions
          </button>
        </div>
      </div>

      {tab === 'stats' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-cyan-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl"><DollarSign className="text-cyan-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Gross Revenue</span>
              </div>
              <p className="text-3xl font-black">${totalRevenue.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-green-400 font-bold">
                <TrendingUp className="w-3 h-3" /> +12.5% from last cycle
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-purple-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl"><ShoppingBag className="text-purple-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Avg Order Value</span>
              </div>
              <p className="text-3xl font-black">${avgOrderValue}</p>
              <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase">Efficiency: 94.2%</div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-blue-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl"><Target className="text-blue-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">CAC (Mocked)</span>
              </div>
              <p className="text-3xl font-black">$42.10</p>
              <div className="mt-2 text-[10px] text-cyan-400 font-bold uppercase">Stable Range</div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 bg-rose-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-500/20 rounded-xl"><Activity className="text-rose-400 w-5 h-5" /></div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Conversion Rate</span>
              </div>
              <p className="text-3xl font-black">3.8%</p>
              <div className="mt-2 text-[10px] text-rose-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                Peak Load detected
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <TrendingUp className="text-cyan-400 w-4 h-4" /> Revenue Trajectory
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Live Uplink</span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      cursor={{stroke: 'rgba(255,255,255,0.1)'}}
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rev" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/10 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Layers className="text-purple-400 w-4 h-4" /> Sector Distribution
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Sales per Category</span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory.length > 0 ? salesByCategory : [{name: 'Empty', value: 1}]}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      {salesByCategory.length === 0 && <Cell fill="rgba(255,255,255,0.05)" />}
                    </Pie>
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px'}}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle" 
                      wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
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
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-500 font-bold italic">
                      No active transmissions detected in the sector.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
