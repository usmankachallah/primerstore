import React from 'react';
import { Cpu, Rocket, Users, Shield, Target, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    { icon: <Target className="w-6 h-6 text-cyan-400" />, title: "Precision", desc: "Every component is engineered with sub-micron accuracy for the digital elite." },
    { icon: <Shield className="w-6 h-6 text-purple-400" />, title: "Security", desc: "Your data is encrypted using post-quantum algorithms within our neural vault." },
    { icon: <Globe className="w-6 h-6 text-blue-400" />, title: "Network", desc: "A global uplink connecting human potential with advanced computational power." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-24 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border border-cyan-500/20">
          Established 2077
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          REDEFINING THE <br />
          <span className="gradient-text">HUMAN-TECH INTERFACE</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          PRIMERSTORE isn't just a marketplace. It's the primary uplink for individuals who refuse to be limited by today's hardware. We build the bridges to tomorrow.
        </p>
      </section>

      {/* Story Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="glass rounded-[3rem] p-8 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu className="w-32 h-32 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-black mb-6">Our Genesis</h2>
          <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
            <p>Founded in the neon heart of Neo-Tokyo, PRIMER began as a small research collective focused on neural audio dampening. We realized that the equipment available to the public was decades behind the potential of human cognition.</p>
            <p>Today, we serve millions across the digital frontier, providing specialized gear that has been stress-tested in the most demanding environments—from deep-space colonies to hyper-dense urban cores.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-[2rem] border border-white/10 aspect-square flex flex-col justify-end">
            <span className="text-4xl font-black text-cyan-400">12M+</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Links</span>
          </div>
          <div className="glass p-6 rounded-[2rem] border border-white/10 aspect-square flex flex-col justify-end">
            <span className="text-4xl font-black text-purple-400">0.0ns</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Latency</span>
          </div>
          <div className="glass p-6 rounded-[2rem] border border-white/10 aspect-square flex flex-col justify-end">
            <span className="text-4xl font-black text-blue-400">2077</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Year Zero</span>
          </div>
          <div className="glass p-6 rounded-[2rem] border border-white/10 aspect-square flex flex-col justify-end">
            <span className="text-4xl font-black text-white">∞</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Potential</span>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="space-y-12">
        <h2 className="text-3xl font-black text-center">Core Protocols</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/10 hover:border-cyan-500/30 transition-all text-center space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="glass rounded-[4rem] p-12 border border-white/10 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 text-center">
        <h2 className="text-4xl font-black mb-6">Ready to Upgrade?</h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto">Join the vanguard of digital evolution. Secure your spot in the matrix with PRIMER tier hardware.</p>
        <button className="px-10 py-4 bg-white text-black rounded-2xl font-black hover:bg-cyan-400 hover:text-white transition-all transform hover:scale-105">
          View Current Inventory
        </button>
      </section>
    </div>
  );
};

export default AboutPage;