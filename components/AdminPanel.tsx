
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Clock, Package, DollarSign, Users } from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, setProducts, updateOrderStatus }) => {
  const [tab, setTab] = useState<'products' | 'orders' | 'stats'>('stats');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const statsData = [
    { name: 'Revenue', value: orders.reduce((acc, curr) => acc + curr.total, 0) },
    { name: 'Orders', value: orders.length },
    { name: 'Inventory', value: products.length },
  ];

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddProduct = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProd: Product = {
      id: newId,
      name: 'New Product',
      price: 0,
      description: 'New Description',
      image: 'https://picsum.photos/seed/new/600/600',
      category: 'Electronics',
      stock: 10
    };
    setProducts(prev => [...prev, newProd]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Command Center</h1>
          <p className="text-slate-400">Manage your futuristic retail empire.</p>
        </div>
        <div className="flex glass rounded-xl p-1 border border-white/10">
          <button 
            onClick={() => setTab('stats')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'stats' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setTab('products')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'products' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setTab('orders')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'orders' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Orders
          </button>
        </div>
      </div>

      {tab === 'stats' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl"><DollarSign className="text-cyan-400" /></div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total Revenue</p>
                <p className="text-2xl font-black">${orders.reduce((a, b) => a + b.total, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl"><Package className="text-purple-400" /></div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Active Orders</p>
                <p className="text-2xl font-black">{orders.length}</p>
              </div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="text-blue-400" /></div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">New Customers</p>
                <p className="text-2xl font-black">124</p>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border border-white/10 h-80">
            <h3 className="text-lg font-bold mb-6">Performance Matrix</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : index === 1 ? '#8b5cf6' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end">
            <button 
              onClick={handleAddProduct}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-bold">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{p.category}</td>
                    <td className="px-6 py-4 font-bold">${p.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${p.stock < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
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
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-cyan-400">#{o.id.toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{o.customerName}</div>
                      <div className="text-[10px] text-slate-500">{o.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{o.date}</td>
                    <td className="px-6 py-4 font-bold">${o.total}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold w-fit ${
                        o.status === OrderStatus.DELIVERED ? 'bg-green-500/20 text-green-400' : 
                        o.status === OrderStatus.PROCESSING ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {o.status === OrderStatus.DELIVERED ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        className="bg-white/5 border border-white/10 text-[10px] rounded-lg p-1 focus:outline-none focus:border-cyan-500"
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      >
                        <option value={OrderStatus.PENDING}>Pending</option>
                        <option value={OrderStatus.PROCESSING}>Processing</option>
                        <option value={OrderStatus.DELIVERED}>Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
