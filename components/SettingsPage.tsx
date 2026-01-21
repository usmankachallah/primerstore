
import React, { useState } from 'react';
import { 
  User, Shield, Bell, Monitor, Globe, Wallet, 
  Trash2, Plus, Key, Eye, EyeOff, AlertTriangle, 
  CheckCircle2, Lock, Phone, Mail, MapPin, 
  Zap, Activity, Cpu, ChevronRight, Save,
  Fingerprint, Package, Bot, X
} from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsPageProps {
  user: UserType | null;
  onUpdateUser: (field: keyof UserType, value: any) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser }) => {
  const [activeSection, setActiveSection] = useState<'identity' | 'security' | 'notifications' | 'interface' | 'network'>('identity');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for adding new address
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const [notifs, setNotifs] = useState({
    orders: true,
    restocks: false,
    marketing: true,
    security: true
  });

  const [interfaceSettings, setInterfaceSettings] = useState({
    motion: true,
    fidelity: 'High',
    overlayDensity: 75
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("System parameters synchronized. All nodes updated.");
    }, 1200);
  };

  const handleAddAddress = () => {
    if (!newAddress.trim() || !user) return;
    const updatedAddresses = [...user.savedAddresses, newAddress.trim()];
    onUpdateUser('savedAddresses', updatedAddresses);
    setNewAddress('');
    setIsAddingAddress(false);
  };

  const handleRemoveAddress = (index: number) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.filter((_, i) => i !== index);
    onUpdateUser('savedAddresses', updatedAddresses);
  };

  const sections = [
    { id: 'identity', label: 'Biological Core', icon: <User className="w-4 h-4" />, color: 'text-cyan-400' },
    { id: 'security', label: 'Neural Shield', icon: <Shield className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'notifications', label: 'Signal Stream', icon: <Bell className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: 'interface', label: 'Vision Matrix', icon: <Monitor className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'network', label: 'Uplink Node', icon: <Globe className="w-4 h-4" />, color: 'text-emerald-400' },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
          <SettingsIcon className="w-8 h-8 text-cyan-400" />
          SYSTEM <span className="gradient-text">PARAMETERS</span>
        </h1>
        <p className="text-slate-500 font-medium">Calibrate your neural experience and security protocols.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-1/4">
          <div className="glass rounded-3xl p-2 border border-white/10 sticky top-32">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-black transition-all uppercase tracking-widest ${
                  activeSection === section.id 
                  ? 'bg-white/10 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeSection === section.id ? section.color : ''}>{section.icon}</span>
                  {section.label}
                </div>
                {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4">
          <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-bl-full blur-3xl pointer-events-none" />

            {/* IDENTITY SECTION */}
            {activeSection === 'identity' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black flex items-center gap-3">
                    <User className="text-cyan-400" /> Identity Core
                  </h2>
                  <div className="text-[10px] font-black bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest">
                    Verified Citizen
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Designation (Full Name)</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input 
                        type="text" 
                        defaultValue={user?.name}
                        onChange={(e) => onUpdateUser('name', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Neural ID (Email)</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        disabled
                        value={user?.email}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comms Uplink (Phone)</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input 
                        type="text" 
                        defaultValue={user?.phone}
                        onChange={(e) => onUpdateUser('phone', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Deployment Nodes (Addresses)
                  </h3>
                  <div className="space-y-4">
                    {user?.savedAddresses.map((addr, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                        <span className="text-sm font-medium">{addr}</span>
                        <button 
                          onClick={() => handleRemoveAddress(idx)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {isAddingAddress ? (
                      <div className="space-y-3 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/20 animate-in slide-in-from-top-2 duration-300">
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                          <input 
                            type="text" 
                            autoFocus
                            placeholder="Enter deployment coordinates..."
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddAddress()}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleAddAddress}
                            className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Confirm Sync
                          </button>
                          <button 
                            onClick={() => { setIsAddingAddress(false); setNewAddress(''); }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Abort
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingAddress(true)}
                        className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-xs font-black text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Initialize New Node
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY SECTION */}
            {activeSection === 'security' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Shield className="text-purple-400" /> Security Protocol
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encryption Key (Password)</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Fingerprint className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Bio-Metric Authorization</p>
                        <p className="text-[10px] text-slate-500 font-medium">Use facial scan or fingerprint for sensitive transactions.</p>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <div className="flex items-center gap-2 mb-4 text-rose-500">
                      <AlertTriangle className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">Danger Zone</h3>
                    </div>
                    <button className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black transition-all uppercase tracking-widest">
                      Terminate Identity Construct
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS SECTION */}
            {activeSection === 'notifications' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Bell className="text-yellow-400" /> Signal Stream
                </h2>

                <div className="space-y-4">
                  {[
                    { key: 'orders', label: 'Order Telemetry', desc: 'Real-time updates on your hardware transmissions.', icon: <Package className="w-4 h-4" /> },
                    { key: 'restocks', label: 'Restock Signals', desc: 'Instant alerts when high-demand units hit the grid.', icon: <Zap className="w-4 h-4" /> },
                    { key: 'security', label: 'Security Breaches', desc: 'Critical alerts if unauthorized uplink attempts occur.', icon: <Shield className="w-4 h-4" /> },
                    { key: 'marketing', label: 'Matrix Insights', desc: 'New product announcements and evolutionary updates.', icon: <Bot className="w-4 h-4" /> },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-yellow-400/10 transition-colors">
                          <span className="text-slate-400 group-hover:text-yellow-400 transition-colors">{item.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifs[item.key as keyof typeof notifs]} 
                          onChange={() => setNotifs({...notifs, [item.key]: !notifs[item.key as keyof typeof notifs]})}
                        />
                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INTERFACE SECTION */}
            {activeSection === 'interface' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Monitor className="text-blue-400" /> Vision Matrix
                </h2>

                <div className="space-y-8">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-bold">Neural Motion Smoothing</p>
                          <p className="text-[10px] text-slate-500 font-medium">Interpolate interface animations for reduced cognitive load.</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={interfaceSettings.motion} 
                          onChange={() => setInterfaceSettings({...interfaceSettings, motion: !interfaceSettings.motion})}
                        />
                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Overlay Density</span>
                      <span className="text-[10px] font-mono text-blue-400">{interfaceSettings.overlayDensity}%</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      value={interfaceSettings.overlayDensity}
                      onChange={(e) => setInterfaceSettings({...interfaceSettings, overlayDensity: parseInt(e.target.value)})}
                    />
                    <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase">
                      <span>Minimal</span>
                      <span>Total Immersion</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {['Low', 'Standard', 'High'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setInterfaceSettings({...interfaceSettings, fidelity: mode})}
                        className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          interfaceSettings.fidelity === mode 
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                          : 'glass border-white/10 text-slate-500 hover:text-white'
                        }`}
                      >
                        {mode} Assets
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NETWORK SECTION */}
            {activeSection === 'network' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Globe className="text-emerald-400" /> Uplink Node
                </h2>

                <div className="space-y-6">
                  <div className="p-8 glass rounded-[2rem] border border-white/10 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                      <Wallet className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">Web3 Nexus Link</h3>
                      <p className="text-xs text-slate-500 max-w-xs">Securely link your decentralized wallet for encrypted credit transfers and hardware NFT ownership.</p>
                    </div>
                    <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                      Synchronize Wallet
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Sector Status</p>
                        <p className="text-xs font-bold">Neo-Tokyo 01 (Online)</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Uplink Latency</p>
                        <p className="text-xs font-bold">0.42ms (Optimal)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-12 pt-8 border-t border-white/10 flex justify-end gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest text-[11px] flex items-center gap-2"
              >
                {isSaving ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Syncing...' : 'Sync Parameters'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Settings icon
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default SettingsPage;
