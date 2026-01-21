
import React, { useState } from 'react';
import { 
  ShieldAlert, Send, FileText, AlertTriangle, 
  Cpu, Activity, CheckCircle2, ArrowLeft, 
  Fingerprint, Upload, Info
} from 'lucide-react';
import { View } from '../types';

interface SupportTicketPageProps {
  setView: (view: View) => void;
}

const SupportTicketPage: React.FC<SupportTicketPageProps> = ({ setView }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [formData, setFormData] = useState({
    type: 'Technical',
    urgency: 'Standard',
    subject: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate neural processing and ticket generation
    setTimeout(() => {
      const newId = `INC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setTicketId(newId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/30">
          <CheckCircle2 className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-5xl font-black mb-4 uppercase">TRANSMISSION BROADCAST</h1>
        <p className="text-slate-400 text-lg mb-12 font-medium">
          Incident Report <span className="text-cyan-400 font-mono">#{ticketId}</span> has been logged in the neural archive.
        </p>
        
        <div className="glass rounded-[3rem] p-8 border border-white/10 text-left mb-12 max-w-2xl mx-auto shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Status</span>
          </div>
          <p className="text-slate-300 text-sm mb-8 leading-relaxed italic">
            "Your ticket has been assigned to a Sector 7 technician. Diagnostics are currently running on your hardware uplink. You will receive a neural ping when a solution is synthesized."
          </p>
          <div className="pt-8 border-t border-white/5 flex justify-between items-center">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estimated Resolution Time</div>
            <div className="text-cyan-400 font-black text-xs uppercase tracking-widest">~ 4-6 Planetary Cycles</div>
          </div>
        </div>

        <button 
          onClick={() => setView('faq')} 
          className="px-10 py-4 glass hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/10 uppercase tracking-widest text-xs"
        >
          Return to Knowledge Base
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => setView('faq')} className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">OPEN <span className="gradient-text">SUPPORT TICKET</span></h1>
          <p className="text-slate-500 text-sm font-medium">Log a formal incident report with the PRIMER maintenance collective.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Incident Sector</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all text-slate-300 text-sm font-bold"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Technical</option>
                  <option>Logistics</option>
                  <option>Financial</option>
                  <option>Security</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Urgency Protocol</label>
                <select 
                  className={`w-full bg-white/5 border rounded-2xl py-4 px-6 focus:outline-none transition-all text-sm font-bold ${
                    formData.urgency === 'Critical' ? 'border-rose-500/50 text-rose-400' : 'border-white/10 text-slate-300'
                  }`}
                  value={formData.urgency}
                  onChange={e => setFormData({...formData, urgency: e.target.value})}
                >
                  <option>Low</option>
                  <option>Standard</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transmission Subject</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Aether Pods neural sync failure"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Log (Description)</label>
              <textarea 
                required
                placeholder="Describe the anomaly in detail..."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-6 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 text-sm leading-relaxed"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Telemetry Attachments (Optional)</label>
              <div className="border-2 border-dashed border-white/5 rounded-3xl p-8 text-center hover:border-cyan-500/30 transition-all cursor-pointer group">
                <Upload className="w-8 h-8 text-slate-700 mx-auto mb-4 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uplink System Logs or Hardware Screenshots</p>
                <p className="text-[8px] text-slate-600 mt-2 font-bold">MAX 50MB per packet</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 group active:scale-95"
            >
              {isSubmitting ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : (
                <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {isSubmitting ? 'ENCRYPTING PACKET...' : 'AUTHORIZE & BROADCAST TICKET'}
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-[2.5rem] p-8 border border-white/10 space-y-6 bg-cyan-500/5">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xs font-black uppercase tracking-widest">Security Notice</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Every support ticket is protected by <span className="text-cyan-400">Zero-Knowledge encryption</span>. Our technicians can only access the telemetry you provide.
            </p>
            <div className="space-y-3">
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> End-to-End Encrypted
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Decentralized Archiving
               </div>
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-black uppercase tracking-widest">Auto-Diagnostics</h3>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Upon submission, our AI bot <span className="text-purple-400">Zenith</span> will attempt to resolve common issues using neural pattern matching.
            </p>
          </div>

          {formData.urgency === 'Critical' && (
            <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex gap-4 animate-in fade-in duration-300">
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Critical Priority Warning</p>
                <p className="text-[10px] text-rose-400/80 leading-relaxed font-bold">Only use Critical status for complete system failures. Misuse may result in temporary neural link throttling.</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 justify-center pt-8 opacity-40">
            <Info className="w-3 h-3 text-slate-500" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol v7.4.2 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketPage;
