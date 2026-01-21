
import React, { useState, useMemo } from 'react';
import { 
  Search, ChevronDown, ChevronUp, HelpCircle, 
  Zap, Shield, CreditCard, Package, Cpu, 
  MessageSquare, ArrowRight, Sparkles, Database,
  ThumbsUp, ThumbsDown, Info
} from 'lucide-react';
import { View } from '../types';

interface FAQPageProps {
  setView: (view: View) => void;
}

const FAQ_DATA: FAQEntry[] = [
  {
    id: 'q1',
    category: 'Logistics',
    question: "What is Quantum Delivery?",
    answer: "Quantum Delivery utilizes orbital drop-pods and synchronized drone swarms to ensure your hardware arrives within 2 planetary cycles. Tracking is provided via real-time telemetry directly to your neural dashboard."
  },
  {
    id: 'q2',
    category: 'Technical',
    question: "How do I sync my neural link with Aether Pods?",
    answer: "Ensure your link is set to 'Discovery Mode' in your system settings. Once the Aether Pods are within 1 meter, the PRIMER handshake protocol will automatically initiate. Bio-authentication will be required for the first sync."
  },
  {
    id: 'q3',
    category: 'Financial',
    question: "Which credit forms are accepted?",
    answer: "We currently accept Standard Global Credits, Block Vault Assets (ETH, BTC, SOL), and direct Neural Link transfers. All transactions are cleared via decentralized ledger for maximum transparency."
  },
  {
    id: 'q4',
    category: 'Security',
    question: "Is my biometric data stored locally?",
    answer: "Yes. PRIMERSTORE adheres to the Zero-Knowledge Protocol. Your biometric fingerprints are stored exclusively within your hardware's secure enclave and are never broadcast to our central servers."
  },
  {
    id: 'q5',
    category: 'Logistics',
    question: "Do you ship to off-world colonies?",
    answer: "Currently, we only provide automated shipping to Low Earth Orbit (LEO) stations. Lunar and Martian colonies require specialized freight scheduling. Contact our Fleet Tech for interplanetary quotes."
  },
  {
    id: 'q6',
    category: 'Technical',
    question: "What happens if a hardware unit malfunctions?",
    answer: "Every unit comes with a lifetime Nexus Guard warranty. If a critical failure is detected during neural diagnostics, we will ship a replacement unit immediately, even before you return the defective module."
  }
];

interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: 'Logistics' | 'Technical' | 'Financial' | 'Security';
}

const FAQPage: React.FC<FAQPageProps> = ({ setView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<string[]>([]);

  const categories = ['All', 'Logistics', 'Technical', 'Financial', 'Security'];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-24 animate-in fade-in duration-700">
      {/* Header */}
      <section className="text-center space-y-8 relative py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-cyan-500/20">
          <Database className="w-3 h-3" /> Neural Knowledge Base
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
          KNOWLEDGE <br />
          <span className="gradient-text">DATABASE</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Access the central archive for technical protocols, logistic telemetry, and security standards.
        </p>
      </section>

      {/* Search & Categories */}
      <section className="space-y-8">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search the archive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 relative z-10"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat 
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' 
                : 'glass text-slate-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="max-w-4xl mx-auto space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div 
                key={faq.id}
                className={`glass rounded-3xl border transition-all duration-300 ${
                  isOpen ? 'border-cyan-500/40 bg-white/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <button 
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded-2xl transition-colors ${
                      isOpen ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {faq.category === 'Logistics' && <Package className="w-5 h-5" />}
                      {faq.category === 'Technical' && <Cpu className="w-5 h-5" />}
                      {faq.category === 'Financial' && <CreditCard className="w-5 h-5" />}
                      {faq.category === 'Security' && <Shield className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">
                        {faq.category} Protocol
                      </span>
                      <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                </button>
                
                {isOpen && (
                  <div className="px-8 pb-8 md:px-24 md:pb-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="h-px w-full bg-white/5 mb-6" />
                    <p className="text-slate-400 leading-relaxed mb-8">
                      {faq.answer}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Was this helpful?</span>
                        <div className="flex gap-2">
                          <button className="p-2 glass rounded-lg hover:bg-green-500/20 text-slate-500 hover:text-green-400 transition-all"><ThumbsUp className="w-3.5 h-3.5" /></button>
                          <button className="p-2 glass rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"><ThumbsDown className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
                         <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                         <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Knowledge Verified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 glass rounded-[3rem] border border-white/10">
            <HelpCircle className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <p className="text-slate-500 font-bold">No entries found matching your neural query.</p>
            <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-cyan-400 text-xs font-black uppercase tracking-widest hover:underline">Clear Filters</button>
          </div>
        )}
      </section>

      {/* Support CTA */}
      <section className="glass rounded-[4rem] p-12 border border-white/10 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 flex flex-col items-center text-center space-y-8">
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10">
          <MessageSquare className="w-10 h-10 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black mb-4">CAN'T FIND AN ANSWER?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Our specialized technicians are available 24/7 for direct neural uplink support.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setView('contact')}
            className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 uppercase text-[11px] tracking-widest flex items-center gap-3"
          >
            Initialize Live Chat <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('support-ticket')}
            className="px-10 py-4 glass hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/10 uppercase text-[11px] tracking-widest"
          >
            Open Support Ticket
          </button>
        </div>
      </section>

      {/* Database Footer Status */}
      <div className="flex items-center justify-center gap-3 pt-12 border-t border-white/5">
        <div className="flex items-center gap-2">
           <Info className="w-3.5 h-3.5 text-slate-600" />
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Database Version: 4.2.0-Alpha</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
           <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Auto-indexing Active</span>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
