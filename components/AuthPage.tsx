import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Fingerprint, Shield, Cpu } from 'lucide-react';

interface AuthPageProps {
  onLogin: (userData: any) => void;
  onClose: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Citizen-01',
      email: formData.email,
      phone: '+1 234 567 890',
      address: 'Neo-Tokyo Sector 4',
      isAdmin: formData.email.includes('admin'),
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="w-full max-w-md relative">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="glass rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-2xl mb-6 border border-cyan-500/20">
              <Cpu className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">
              {mode === 'login' ? 'NEURAL SYNC' : 'CONSTRUCT IDENTITY'}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              {mode === 'login' ? 'Authorize access to your digital vault.' : 'Initialize your presence in the PRIMER matrix.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Designation</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Neo Anderson"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Uplink Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="nexus@matrix.io"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encryption Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 mt-4 group"
            >
              <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {mode === 'login' ? 'INITIATE UPLINK' : 'AUTHORIZE CONSTRUCT'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500 mb-4">
              {mode === 'login' ? "New to the nexus?" : "Already part of the network?"}
            </p>
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-cyan-400 font-bold text-sm flex items-center gap-2 mx-auto hover:gap-3 transition-all"
            >
              {mode === 'login' ? 'Create a new identity' : 'Synchronize existing vault'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale">
            <Shield className="w-5 h-5" />
            <div className="h-4 w-px bg-white/20" />
            <p className="text-[10px] font-black tracking-widest uppercase">Secured by Primer Guard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;