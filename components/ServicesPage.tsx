
import React from 'react';
import { 
  Wrench, Cpu, Zap, ShieldCheck, Activity, Globe, 
  ArrowRight, CheckCircle2, Bot, Sparkles, Clock, 
  HardDrive, Monitor, Search
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  const serviceProtocols = [
    {
      id: 'diagnostics',
      icon: <Search className="w-8 h-8 text-cyan-400" />,
      title: "Neural Diagnostics",
      desc: "Comprehensive remote scanning for all sensory-linked hardware. We identify and patch firmware vulnerabilities before they affect your perception.",
      stats: { uptime: "99.99%", speed: "0.2ms Latency" },
      color: "border-cyan-500/20"
    },
    {
      id: 'calibration',
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Uplink Calibration",
      desc: "Optimization of quantum network nodes for decentralized commerce. Essential for users requiring zero-lag financial transmissions.",
      stats: { uptime: "100%", speed: "Quantum-Safe" },
      color: "border-purple-500/20"
    },
    {
      id: 'vaulting',
      icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
      title: "Data Vaulting",
      desc: "Post-quantum encrypted storage for your biometric and neural backups. Hosted on our orbital cold-storage clusters.",
      stats: { uptime: "99.98%", speed: "Tier 4 Security" },
      color: "border-blue-500/20"
    },
    {
      id: 'maintenance',
      icon: <Wrench className="w-8 h-8 text-emerald-400" />,
      title: "Physical Restoration",
      desc: "Hardware refurbishing for damaged VR decks and wearable frames. We use nano-composite printing to return units to factory-new status.",
      stats: { uptime: "24/7 Ops", speed: "48h Turnaround" },
      color: "border-emerald-500/20"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-24 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative overflow-hidden py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-6 border border-cyan-500/20">
          Maintenance & Optimization
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
          SYSTEM <br />
          <span className="gradient-text">PROTOCOLS</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Beyond the hardware. We provide the neural infrastructure and technical support required to maintain peak human performance.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {serviceProtocols.map((protocol) => (
          <div 
            key={protocol.id} 
            className={`glass p-10 rounded-[3rem] border ${protocol.color} hover:border-white/20 transition-all group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700">
              {protocol.icon}
            </div>
            
            <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
              {protocol.icon}
            </div>
            
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{protocol.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-10 min-h-[60px]">
              {protocol.desc}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-black text-white">{protocol.stats.uptime}</p>
              </div>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Metric</p>
                <p className="text-xs font-black text-white">{protocol.stats.speed}</p>
              </div>
            </div>
            
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 flex items-center justify-center gap-2 transition-all group/btn">
              Initialize Protocol <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </section>

      {/* Tiers Comparison */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Service Classes</h2>
          <p className="text-slate-500 text-sm">Select your authorization level for priority access.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Initiate', price: 'Free', features: ['Standard Diagnostics', 'Email Support', 'Basic Recovery'], active: false },
            { name: 'Vanguard', price: '49/mo', features: ['Priority Diagnostics', 'Neural Overclocking', '48h Repair Guarantee', 'Zenith AI Concierge'], active: true },
            { name: 'Ethereal', price: '199/mo', features: ['Real-time Monitoring', 'Orbital Data Vaulting', 'Instant Hardware Swap', 'Dedicated Human Tech'], active: false },
          ].map((tier) => (
            <div 
              key={tier.name}
              className={`glass rounded-[3rem] p-8 border ${tier.active ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/10'} relative overflow-hidden`}
            >
              {tier.active && (
                <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                  Optimal Choice
                </div>
              )}
              
              <div className="mb-8">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{tier.name} Class</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">${tier.price.split('/')[0]}</span>
                  <span className="text-xs text-slate-500 font-bold">{tier.price.includes('/') ? '/mo' : ''}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-10">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-xs font-medium text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${tier.active ? 'text-cyan-400' : 'text-slate-600'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                tier.active ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}>
                Authorize Tier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure CTA */}
      <section className="glass rounded-[4rem] p-12 md:p-16 border border-white/10 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent)] opacity-50 pointer-events-none" />
        
        <div className="max-w-lg space-y-6 relative z-10 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Live Node Status</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight leading-tight">DEDICATED <br /><span className="text-purple-400">COMMAND UPLINK</span></h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Require custom architecture for your organization? Our enterprise technicians can build tailored neural grids for high-performance clusters.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto relative z-10">
          <button className="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-[2rem] font-black transition-all shadow-xl shadow-cyan-500/20 uppercase text-[11px] tracking-widest">
            Contact Fleet Tech
          </button>
          <div className="flex items-center justify-center gap-4 text-slate-500">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-800" />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">12 Techs Available</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
