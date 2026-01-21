
import React from 'react';
import { Fingerprint, Eye, ShieldCheck, Lock, Activity, Info, ArrowLeft, Cpu, Database } from 'lucide-react';
import { View } from '../types';

interface BiometricPolicyPageProps {
  setView: (view: View) => void;
}

const BiometricPolicyPage: React.FC<BiometricPolicyPageProps> = ({ setView }) => {
  const protocols = [
    {
      title: "Local Enclave Isolation",
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      desc: "Your biological hash—including retina, fingerprint, and neural wave patterns—is stored exclusively within your hardware's 'Black Box' secure enclave. It is never transmitted to the PRIMER cloud or third-party relays."
    },
    {
      title: "One-Way Cryptographic Hashing",
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      desc: "All biometric inputs are instantly converted into irreversible cryptographic strings. We store the math, not the image. Reconstructing organic features from these strings is mathematically impossible within current and projected quantum limits."
    },
    {
      title: "Zero-Knowledge Authentication",
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      desc: "During checkout or login, our servers only receive a 'Success' or 'Failure' signal from your local device. We verify that you are you without ever seeing the data that proves it."
    },
    {
      title: "Neural Signature Decay",
      icon: <Activity className="w-6 h-6 text-rose-400" />,
      desc: "Neural telemetry used for session stability is subject to 'Volatile Memory Protocols'. This means session-specific data is automatically purged from RAM every 120 seconds or upon link termination."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => setView('home')} className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">BIOMETRIC <span className="gradient-text">SAFEGUARD</span></h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Privacy Protocol v4.2.9-Secure</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Intro Panel */}
        <div className="glass rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden bg-gradient-to-br from-cyan-500/5 to-transparent">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Fingerprint className="w-64 h-64 text-cyan-400" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Eye className="text-cyan-400 w-6 h-6" /> DATA INTEGRITY MANIFESTO
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg font-medium italic mb-8">
              "In the age of neural synthesis, your biological identity is your last bastion of true privacy. PRIMERSTORE is built on the foundation that your organic data belongs to you alone. We provide the tools to secure it."
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Zero-Knowledge Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <Database className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">No Cloud Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protocols Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {protocols.map((p, idx) => (
            <div key={idx} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/20 transition-all group">
              <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                {p.icon}
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Compliance Footer */}
        <div className="p-10 glass rounded-[3rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest">Citizen Empowerment</h4>
              <p className="text-xs text-slate-500 font-medium">You have the absolute right to request a 'Total Wipe' of all decentralized session IDs at any point through the system dashboard.</p>
            </div>
          </div>
          <button 
            onClick={() => setView('settings')}
            className="px-8 py-4 glass hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 transition-all"
          >
            Manage Identity Settings
          </button>
        </div>

        {/* Audit Status */}
        <div className="flex items-center justify-center gap-6 opacity-30">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Passed: 2077.Q2 System Clear</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kernel Integrity Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricPolicyPage;
