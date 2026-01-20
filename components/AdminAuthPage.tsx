import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Lock, Key, Eye, Fingerprint, Activity, Server } from 'lucide-react';

interface AdminAuthPageProps {
  onLogin: (userData: any) => void;
  onClose: () => void;
}

const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onLogin, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const startupLogs = [
      "Initializing secure handshake...",
      "Connecting to Command Core...",
      "Bypassing standard neural filters...",
      "Admin credentials required for Sector 7 access."
    ];
    
    startupLogs.forEach((log, i) => {
      setTimeout(() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]), i * 400);
    });
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setIsScanning(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] INITIATING BIO-METRIC SCAN...`]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        const adminUser = {
          id: 'ADMIN-001',
          name: 'Supreme Commander',
          email: 'admin@primer.store',
          phone: 'SECURE-LINE-01',
          address: 'Central Command Hub',
          isAdmin: true,
        };
        
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ACCESS GRANTED. WELCOME OVERLORD.`]);
        setTimeout(() => onLogin(adminUser), 800);
      }
    }, 50);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 animate-in fade-in duration-700 bg-[#020617]">
      <div className="w-full max-w-2xl relative">
        {/* Intense background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="glass border-2 border-purple-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
          <div className="bg-purple-500/10 px-8 py-4 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-xs font-black tracking-[0.2em] text-purple-400 uppercase">Restricted Access Terminal</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left side: Terminal & Logs */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Logs</h2>
              </div>
              <div className="bg-black/60 rounded-2xl p-4 h-48 border border-white/5 overflow-y-auto font-mono text-[10px] leading-relaxed scrollbar-hide">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1 text-slate-400">
                    <span className="text-purple-500/70">{">"}</span> {log}
                  </div>
                ))}
                <div className="animate-pulse inline-block w-1.5 h-3 bg-purple-500 ml-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-1">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Entropy</span>
                  <span className="text-[10px] font-mono font-bold">0.00042</span>
                </div>
                <div className="glass p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-1">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Cluster</span>
                  <span className="text-[10px] font-mono font-bold">NODE-X7</span>
                </div>
              </div>
            </div>

            {/* Right side: Login Form */}
            <div className="flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                  <Key className="w-6 h-6 text-purple-400" /> Clearance
                </h3>
                <p className="text-xs text-slate-500 font-medium">Please provide your specialized encryption key to bypass security protocols.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Passcode</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 group-focus-within:text-white transition-colors" />
                    <input 
                      type="password" 
                      required
                      placeholder="SECURE-AUTH-KEY"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-purple-500 transition-all placeholder:text-purple-900 font-mono text-sm tracking-widest text-white"
                    />
                  </div>
                </div>

                <div className="relative">
                  {isScanning ? (
                    <div className="space-y-4">
                      <div className="h-12 w-full bg-purple-500/10 rounded-2xl border border-purple-500/30 overflow-hidden relative">
                        <div 
                          className="h-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white mix-blend-difference">
                            Scanning Bio-Signature: {scanProgress}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Fingerprint className="w-12 h-12 text-purple-400 animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 group border border-purple-400/30"
                    >
                      <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      INITIATE SCAN
                    </button>
                  )}
                </div>
              </form>
              
              <button 
                onClick={onClose}
                className="mt-6 text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
              >
                Abort Protocol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;