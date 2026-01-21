
import React from 'react';
import { Shield, FileText, Lock, Cpu, Zap, ArrowLeft, CheckSquare, AlertCircle, Info } from 'lucide-react';
import { View } from '../types';

interface SyncTermsPageProps {
  setView: (view: View) => void;
}

const SyncTermsPage: React.FC<SyncTermsPageProps> = ({ setView }) => {
  const sections = [
    {
      title: "01. Neural Authorization",
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      content: "By initializing a 'Sync' with PRIMERSTORE, you authorize the temporary extraction of non-volatile neural metadata required for biometric verification. This data is processed exclusively within our decentralized hardware nodes and is purged every 24 solar cycles."
    },
    {
      title: "02. Transaction Protocols",
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      content: "All credit transfers are finalized via the Omni-Ledger Network. Once a hardware deployment transmission is authorized, the associated credits are locked in escrow. PRIMER Corp. reserves the right to throttle neural links in the event of ledger discrepancies."
    },
    {
      title: "03. Zero-Knowledge Privacy",
      icon: <Lock className="w-5 h-5 text-blue-400" />,
      content: "Your biological identity is shielded by the PRIMER-42 encryption standard. We do not store, sell, or broadcast your organic signatures. Your hardware remains your property; we only provide the bridge to the distribution grid."
    },
    {
      title: "04. Hardware Liability",
      icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
      content: "PRIMERSTORE is not responsible for neural feedback loops caused by unauthorized overclocking of modules. Users are advised to maintain sync fidelity within the recommended safety parameters (see Sector Guard manual)."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => setView('home')} className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">SYNC <span className="gradient-text">PROTOCOLS</span></h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Master Terms of Service v8.1.0-Core</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FileText className="w-48 h-48 text-cyan-400" />
          </div>

          <div className="space-y-12 relative z-10">
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-400 leading-relaxed font-medium italic">
                "Welcome to the collective. Before you uplink with our distribution grid, please review the synchronization protocols that govern our digital interaction. By accessing PRIMERSTORE, you agree to the following neural handshake parameters."
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {sections.map((section, idx) => (
                <div key={idx} className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight">{section.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/20 flex gap-4">
              <Shield className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Encrypted Legal Shield</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">This document is hashed on the Decentralized Prime Network. Any modification to these terms will trigger an instant neural notification to all synchronized citizens.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Last Synced: 2077.05.20.1102</span>
          </div>
          <button 
            onClick={() => setView('shop')}
            className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest text-xs flex items-center gap-3"
          >
            <CheckSquare className="w-4 h-4" />
            Accept & Access Grid
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncTermsPage;
