
import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Filter, ArrowLeft, ChevronDown, ChevronUp, 
  Clock, CheckCircle2, Truck, Activity, Cpu, RefreshCw, 
  MapPin, ShoppingBag, ExternalLink, Box, Terminal, Zap, Info
} from 'lucide-react';
import { Order, OrderStatus, View, Product } from '../types';

interface OrderHistoryPageProps {
  orders: Order[];
  setView: (view: View) => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, setView, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'text-green-400 bg-green-500/10 border-green-500/20';
      case OrderStatus.PENDING: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case OrderStatus.PROCESSING: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case OrderStatus.CANCELLED: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getTrackingSteps = (status: OrderStatus) => {
    const steps = [
      { label: 'Transmission Sent', icon: <Terminal className="w-4 h-4" />, complete: true },
      { label: 'Neural Syncing', icon: <Activity className="w-4 h-4" />, complete: status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED },
      { label: 'In Transit', icon: <Truck className="w-4 h-4" />, complete: status === OrderStatus.DELIVERED },
      { label: 'Node Arrival', icon: <CheckCircle2 className="w-4 h-4" />, complete: status === OrderStatus.DELIVERED },
    ];
    return steps;
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      onAddToCart(item, item.quantity, item.selectedVariants);
    });
    setView('cart');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-cyan-400 mb-2">
            <Package className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Neural Archive</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">ORDER <span className="gradient-text">HISTORY</span></h1>
        </div>
        <button 
          onClick={() => setView('profile')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search transmission ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all font-bold text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all appearance-none font-black uppercase text-[10px] tracking-widest text-slate-300"
          >
            <option value="All">All Statuses</option>
            {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className={`glass rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                expandedOrderId === order.id ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.1)]' : 'border-white/5 hover:border-white/10'
              }`}
            >
              {/* Summary View */}
              <div 
                className="p-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-8 cursor-pointer"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                    <img src={order.items[0].image} className="w-full h-full object-cover opacity-60" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-cyan-400 text-sm font-bold mb-1 uppercase">#{order.id}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black">${order.total}</span>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className="text-xs text-slate-500 font-bold">{order.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  {expandedOrderId === order.id ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                </div>
              </div>

              {/* Expanded View */}
              {expandedOrderId === order.id && (
                <div className="px-8 pb-8 space-y-10 animate-in slide-in-from-top-4 duration-500">
                  <div className="h-px w-full bg-white/5" />
                  
                  {/* Tracking Timeline */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" /> Tracking Telemetry
                    </h3>
                    <div className="relative flex justify-between items-start max-w-2xl mx-auto px-4">
                      {/* Connector Line */}
                      <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/5" />
                      {/* Active Line */}
                      <div 
                        className="absolute top-5 left-8 h-0.5 bg-cyan-500 transition-all duration-1000" 
                        style={{ width: order.status === OrderStatus.DELIVERED ? 'calc(100% - 64px)' : order.status === OrderStatus.PROCESSING ? '40%' : '0%' }}
                      />
                      
                      {getTrackingSteps(order.status).map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center text-center gap-3 group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                            step.complete 
                            ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                            : 'bg-slate-900 border-white/10 text-slate-600'
                          }`}>
                            {step.icon}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-tighter ${step.complete ? 'text-white' : 'text-slate-600'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Item Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Box className="w-3.5 h-3.5" /> Payload Contents
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                            <div>
                              <p className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase">{item.name}</p>
                              {item.selectedVariants && (
                                <div className="flex gap-2 mt-1">
                                  {Object.entries(item.selectedVariants).map(([k, v]) => (
                                    <span key={k} className="text-[8px] font-black uppercase text-slate-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                      {k}: {v}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-white">{item.quantity} Unit(s)</p>
                            <p className="text-[10px] font-mono text-slate-500">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Logistics */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <MapPin className="w-4 h-4 text-rose-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Deployment Destination</p>
                        <p className="text-xs font-bold text-slate-300">{order.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                      <button 
                        onClick={() => handleReorder(order)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20"
                      >
                        <RefreshCw className="w-3 h-3" /> Re-Initialize Protocol
                      </button>
                      <button 
                        onClick={() => setView('support-ticket')}
                        className="flex-1 lg:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all"
                      >
                        Help Signal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-32 glass rounded-[3rem] border border-white/10 border-dashed text-center flex flex-col items-center justify-center space-y-6">
            <ShoppingBag className="w-16 h-16 text-slate-800" />
            <div>
              <p className="text-xl font-bold mb-1">Archive is vacant</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">No previous hardware transmissions found in your current sector.</p>
            </div>
            <button 
              onClick={() => setView('shop')}
              className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest text-[11px]"
            >
              Browse Catalog
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-slate-500" />
          <span className="text-[9px] font-black uppercase tracking-widest">Records preserved on Omni-Ledger v8.4</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">Sync Health: 100%</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Secure Handshake: Active</span>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
