import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-black mb-6">SECURE <br/><span className="gradient-text">UPLINK</span></h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Need direct assistance with your neural hardware? Our technicians are standing by in the central hub to facilitate your needs.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Address</p>
                <p className="text-lg font-bold">transmissions@primer.store</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors">
                <Phone className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Direct Link</p>
                <p className="text-lg font-bold">+1 (888) PRIMER-77</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nexus Coordinates</p>
                <p className="text-lg font-bold">Neo-Tokyo, Sector 7G, Core C</p>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-cyan-500/5">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold">Encrypted Communication</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">All messages transmitted through this uplink are end-to-end encrypted via decentralized ledger technology. Your identity is shielded by PRIMER Guard v4.2.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl relative">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-black">Transmission Received</h2>
              <p className="text-slate-400">Our neural processors are analyzing your request. Expect a synchronization within 2 cycles.</p>
              <button onClick={() => setSubmitted(false)} className="text-cyan-400 text-sm font-bold uppercase tracking-widest hover:underline">Send Another Transmission</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Designation</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Neural Uplink (Email)</label>
                <input 
                  type="email" 
                  required
                  placeholder="nexus@matrix.io"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transmission Subject</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all text-slate-400"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                >
                  <option>General Inquiry</option>
                  <option>Hardware Support</option>
                  <option>Merchant Partnership</option>
                  <option>Corporate Governance</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message Buffer</label>
                <textarea 
                  required
                  placeholder="Detail your request..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                SUBMIT TRANSMISSION
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;