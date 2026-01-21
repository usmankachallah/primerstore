
import React, { useState } from 'react';
import { Mail, Send, Zap, CheckCircle2, Activity, Bell, Sparkles } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'syncing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('syncing');
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus('complete');
      }
    }, 50);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="relative glass rounded-[4rem] p-12 md:p-20 border border-white/10 overflow-hidden group">
        {/* Animated Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.08),transparent)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.08),transparent)] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                <Bell className="w-6 h-6 text-cyan-400 animate-bounce" />
              </div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Signal Frequency</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
              NEURAL <br />
              <span className="gradient-text">FEEDBACK</span>
            </h2>
            
            <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">
              Synchronize your neural link with our latest hardware drops, sector alerts, and exclusive vanguard iterations.
            </p>

            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weekly Uplink</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zero Spam Policy</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {status === 'complete' ? (
              <div className="glass rounded-[3rem] p-12 border border-green-500/30 text-center animate-in zoom-in duration-500 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-black mb-3">UPLINK ESTABLISHED</h3>
                <p className="text-slate-400 text-sm font-medium">Your address has been added to the secure vanguard registry. Welcome to the future.</p>
                <button 
                  onClick={() => { setStatus('idle'); setEmail(''); setProgress(0); }}
                  className="mt-8 text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Synchronize another node
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Uplink Address (Email)</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="email" 
                      required
                      disabled={status === 'syncing'}
                      placeholder="nexus-core@grid.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700 disabled:opacity-50"
                    />
                  </div>
                </div>

                {status === 'syncing' ? (
                  <div className="space-y-4 py-2">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 animate-pulse">
                      <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> Performing Handshake...</span>
                      <span>{progress}%</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-[2rem] font-black transition-all shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-4 group active:scale-95"
                  >
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    AUTHORIZE NEURAL UPLINK
                  </button>
                )}

                <p className="text-[9px] text-slate-600 font-bold text-center uppercase tracking-widest mt-6">
                  By authorizing, you agree to our <span className="text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">Neural Sync Protocols</span> and biometric terms.
                </p>
              </form>
            )}

            {/* Subtle floating decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-1000" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-1000 delay-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
