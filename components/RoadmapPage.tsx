
import React from 'react';
import { 
  Zap, Rocket, Shield, Cpu, Globe, 
  CheckCircle2, Clock, Sparkles, TrendingUp,
  Database, Activity, ArrowRight, MessageSquare
} from 'lucide-react';

const RoadmapPage: React.FC = () => {
  const milestones = [
    {
      id: 'm1',
      version: 'v1.0 Genesis',
      date: '2075 - 2076',
      title: 'Neural Foundation',
      desc: 'Initialization of the PRIMER research collective. Development of foundational neural audio damping protocols and bio-metric handshake standards.',
      status: 'Archived',
      icon: <Cpu className="w-5 h-5" />,
      color: 'bg-slate-500'
    },
    {
      id: 'm2',
      version: 'v2.5 Expansion',
      date: '2076 - 2077',
      title: 'Marketplace Uplink',
      desc: 'Launch of the first consumer-facing distribution grid. Integration of decentralized credit exchanges and the introduction of the Zenith AI concierge.',
      status: 'Live',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-cyan-500'
    },
    {
      id: 'm3',
      version: 'v4.2 Current',
      date: 'Present',
      title: 'Immersion Protocol',
      desc: 'Deployment of WebXR spatial analysis tools and AR hardware projection. Zero-latency biometric vaulting goes live across Neo-Tokyo nodes.',
      status: 'Active',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-purple-500',
      isCurrent: true
    },
    {
      id: 'm4',
      version: 'v5.0 Orbit',
      date: 'Q3 2078',
      title: 'Orbital Distribution',
      desc: 'Establishment of automated drop-pod delivery channels for LEO (Low Earth Orbit) colonies. Introduction of off-world hardware tiering.',
      status: 'In Development',
      icon: <Rocket className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'm5',
      version: 'v6.0 Synthesis',
      date: '2079+',
      title: 'Total Immersion',
      desc: 'The final phase of the PRIMER roadmap. Integration of direct-to-neural sensory input modules, bypassing traditional hardware peripherals entirely.',
      status: 'Projection',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-24 animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="text-center space-y-8 relative py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-purple-500/20">
          <TrendingUp className="w-3 h-3" /> System Roadmap v4.2
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
          PROJECTED <br />
          <span className="gradient-text">EVOLUTION</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tracking the trajectory of PRIMER technology. We don't just predict the future; we build the protocols that define it.
        </p>
      </section>

      {/* Timeline Section */}
      <section className="relative max-w-4xl mx-auto">
        {/* Central Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-800 via-cyan-500/40 to-slate-800 hidden md:block" />

        <div className="space-y-20">
          {milestones.map((m, idx) => (
            <div 
              key={m.id} 
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                idx % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-[#020617] rounded-full border border-white/10 z-10 flex items-center justify-center group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${m.color}/20 ${m.color} text-white ${m.isCurrent ? 'animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}>
                  {m.icon}
                </div>
                {m.isCurrent && (
                  <div className="absolute -inset-2 border border-cyan-500/30 rounded-full animate-ping opacity-20" />
                )}
              </div>

              {/* Content Card */}
              <div className="w-full md:w-5/12">
                <div className={`glass p-8 rounded-[2.5rem] border border-white/5 transition-all hover:border-white/20 group ${m.isCurrent ? 'bg-cyan-500/5 border-cyan-500/30' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        m.status === 'Live' ? 'bg-cyan-500/20 text-cyan-400' : 
                        m.status === 'Active' ? 'bg-purple-500/20 text-purple-400' : 
                        m.status === 'In Development' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-500'
                      }`}>
                        {m.status}
                      </span>
                      <p className="text-[10px] font-black text-slate-500 mt-3 uppercase tracking-[0.2em]">{m.date}</p>
                    </div>
                    <span className="font-mono text-xs text-slate-600 font-bold">{m.version}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight group-hover:text-white transition-colors">{m.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                    {m.desc}
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <Activity className="w-3.5 h-3.5 text-slate-600" />
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol v{idx}.0.1</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Shield className="w-3.5 h-3.5 text-slate-600" />
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spacer for MD view to balance the timeline */}
              <div className="hidden md:block md:w-5/12" />
            </div>
          ))}
        </div>
      </section>

      {/* Projection Grid */}
      <section className="space-y-16 pt-24">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-4 uppercase">FUTURE NODES</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Specific project focus areas currently under development in the PRIMER R&D sectors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Neural NFT Sync", 
              desc: "Ownership tokens for hardware modules mapped directly to your bio-signature.", 
              icon: <Database className="w-6 h-6 text-cyan-400" />,
              progress: 65 
            },
            { 
              title: "Haptic Feedback Grid", 
              desc: "Full-body tactile simulation using quantum entanglement sensors.", 
              icon: <Activity className="w-6 h-6 text-purple-400" />,
              progress: 42 
            },
            { 
              title: "Sector 07 Retail Hub", 
              desc: "Physical AR hubs for direct hardware stress-testing in neo-urban environments.", 
              icon: <Globe className="w-6 h-6 text-blue-400" />,
              progress: 15 
            }
          ].map((node) => (
            <div key={node.title} className="glass p-8 rounded-[3rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                {node.icon}
              </div>
              <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl border border-white/5">
                {node.icon}
              </div>
              <h4 className="text-lg font-black mb-3 uppercase tracking-tight">{node.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-8 font-medium">{node.desc}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Development Progress</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{node.progress}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all duration-1000" 
                    style={{ width: `${node.progress}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Uplink CTA */}
      <section className="glass rounded-[4rem] p-12 md:p-20 border border-white/10 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent)] opacity-50" />
        <div className="relative z-10 space-y-10">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 mx-auto">
            <MessageSquare className="w-10 h-10 text-cyan-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tight">SHAPE THE <span className="gradient-text">TRAJECTORY</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              Our roadmap is driven by user telemetry and community feedback. Have a protocol suggestion or a hardware requirement? Uplink with our collective.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-[2rem] font-black transition-all shadow-xl shadow-cyan-500/20 uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 group">
              Submit Proposal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 glass hover:bg-white/10 text-white rounded-[2rem] font-black transition-all border border-white/10 uppercase text-[11px] tracking-widest">
              Join Discord Cluster
            </button>
          </div>
        </div>
      </section>

      {/* Footer Status */}
      <div className="flex items-center justify-center gap-6 pt-12 border-t border-white/5 opacity-40">
        <div className="flex items-center gap-2">
           <Clock className="w-3.5 h-3.5 text-slate-500" />
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Last Update: 2077.04.12.0834</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
           <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Roadmap Integrity Verified</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
