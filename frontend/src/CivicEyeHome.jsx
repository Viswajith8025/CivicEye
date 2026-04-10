import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  MapPin, 
  Search, 
  ArrowRight, 
  Eye, 
  Shield, 
  Clock, 
  Lock,
  Flag,
  Globe,
  Database,
  SearchCode,
  LineChart,
  Network,
  Scale
} from "lucide-react";
import logo from "./assets/celogofull.png";

export const CivicEyeHome = () => {
  const reports = [
    { block: "B-88220", type: "Traffic Incident", sector: "Sector Alpha-7", status: "VERIFIED", timestamp: "14:22:10 UTC" },
    { block: "B-88219", type: "Parking Conflict", sector: "Industrial West", status: "RESOLVED", timestamp: "13:58:45 UTC" },
    { block: "B-88218", type: "Noise Violation", sector: "Residential 04", status: "PENDING", timestamp: "13:42:12 UTC" },
    { block: "B-88217", type: "Sanitation Issue", sector: "Commercial Core", status: "VERIFIED", timestamp: "12:15:33 UTC" },
  ];

  return (
    <div className="bg-bgColor min-h-screen flex selection:bg-primary/10">
      
      {/* 🧭 THE CONTROL PANEL (PERSISTENT SLIM SIDEBAR) */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-24 bg-accent-dark z-[100] flex flex-col items-center py-10 shadow-2xl">
        <Link to="/" className="mb-20">
          <img src={logo} alt="CivicEye" className="h-4 brightness-0 invert opacity-40 hover:opacity-100 transition-opacity" />
        </Link>
        
        <nav className="flex-1 flex flex-col gap-12">
          <Link to="/complaints" className="p-3 text-white/40 hover:text-white transition-colors">
            <Globe size={20} />
          </Link>
          <Link to="/about" className="p-3 text-white/40 hover:text-white transition-colors">
            <Scale size={20} />
          </Link>
          <Link to="/login" className="p-3 text-white/40 hover:text-white transition-colors mt-auto">
            <Lock size={20} />
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-20 md:ml-24">
        
        {/* 🏛️ HERO: INFRASTRUCTURE HUB */}
        <section className="relative pt-32 pb-40 md:pt-48 md:pb-60 bg-white border-b border-slate-200">
          <div className="section-container relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl space-y-12"
            >
              <div className="flex items-center gap-3 text-primary font-bold text-[10px] tracking-[0.4em] uppercase">
                <Network size={14} />
                <span>Civilian Oversight Infrastructure</span>
              </div>

              <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-accent-dark leading-[0.8] uppercase">
                Official <br />
                <span className="text-secondary">Governance.</span>
              </h1>

              <p className="max-w-xl text-slate-500 font-medium text-lg leading-relaxed">
                A high-integrity digital framework for community accountability. 
                Securing civilian reporting through cryptographic standards 
                and verified institutional resolution.
              </p>

              <div className="flex pt-6">
                <Link to="/signup" className="btn-official">
                  Submit Verifiable Report
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Sidebar Branding / Sub-text */}
            <div className="hidden lg:block border-l-2 border-slate-100 pl-12 max-w-[240px] space-y-8">
              <div className="space-y-2">
                <span className="font-mono text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status // Active</span>
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">Established standards for community oversight protocols.</p>
              </div>
              <div className="space-y-4">
                <div className="h-40 w-full bg-slate-50 border border-slate-100 p-4 flex flex-col justify-between">
                  <LineChart size={16} className="text-secondary" />
                  <span className="font-mono text-[10px] font-bold text-secondary">METRIC: 99.8% VERIFICATION</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🗃️ THE REGISTRY (OFFICIAL ACTIVITY) */}
        <section className="py-32">
          <div className="section-container">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
                  <Database size={12} />
                  <span>Real-Time Incident Registry</span>
                </div>
                <h2 className="text-4xl font-bold text-accent-dark">Operational Records</h2>
              </div>
              <Link to="/complaints" className="text-[10px] font-bold text-primary uppercase tracking-widest border-b-2 border-primary pb-2 hover:text-accent-dark hover:border-accent-dark transition-all">
                Export Dashboard Data
              </Link>
            </div>

            <div className="governance-card overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 grid grid-cols-5 text-[8px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <span>Block ID</span>
                <span>Incident Matrix</span>
                <span>Geographic Sector</span>
                <span>Registry Status</span>
                <span className="text-right">Sync-Time</span>
              </div>
              
              {reports.map((report, i) => (
                <div key={i} className="registry-row grid grid-cols-5 items-center">
                  <span className="text-secondary font-bold">{report.block}</span>
                  <span className="text-accent-dark font-bold uppercase">{report.type}</span>
                  <span className="text-slate-500">{report.sector}</span>
                  <div>
                    <span className={`px-2 py-0.5 rounded-sm font-bold text-[8px] ${
                      report.status === "VERIFIED" ? "bg-primary/10 text-primary" : 
                      report.status === "RESOLVED" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <span className="text-right text-slate-400">{report.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-16 text-slate-300">
               <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Auth: GS-442</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.4em]">V-Layer: Active</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Latency: 14ms</span>
            </div>
          </div>
        </section>

        {/* 🛡️ MATTE STANDARDS (TRUST INFRASTRUCTURE) */}
        <section className="py-32 bg-white border-y border-slate-100">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              <div className="space-y-8">
                <SearchCode className="text-primary" size={40} />
                <h3 className="text-2xl font-bold">Verifiable Logic</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Every incident report is processed through our verifiable audit trail, ensuring that civilian data remains immutable and transparent.</p>
                <div className="w-12 h-[1px] bg-slate-200" />
              </div>
              <div className="space-y-8">
                <ShieldCheck className="text-primary" size={40} />
                <h3 className="text-2xl font-bold">Encrypted Custody</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Data sovereignty is our primary standard. All reports are cryptographically signed at the point of origin to prevent unauthorized tampering.</p>
                <div className="w-12 h-[1px] bg-slate-200" />
              </div>
              <div className="space-y-8">
                <Flag className="text-primary" size={40} />
                <h3 className="text-2xl font-bold">Institutional Link</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Verified reports are instantly dispatched to the relevant institutional authorities via our secure infrastructure pipe.</p>
                <div className="w-12 h-[1px] bg-slate-200" />
              </div>
            </div>
          </div>
        </section>

        {/* 🏛️ GLOBAL GOVERNANCE FOOTER */}
        <footer className="bg-accent-dark text-slate-500 py-32 pt-48">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
              <div className="md:col-span-2 space-y-12">
                <img src={logo} alt="CivicEye" className="h-5 brightness-0 invert opacity-20 grayscale" />
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Infrastructure Mandate</h4>
                  <p className="text-xs font-medium leading-relaxed max-w-sm uppercase tracking-wider text-slate-600">
                    The official infrastructure for digital civic engagement. 
                    Bridging the institutional gap through cryptographic 
                    transparency and decentralized oversight.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Platform Governance</h4>
                <nav className="flex flex-col gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Link to="/about" className="hover:text-white transition-colors">Surveillance Policy</Link>
                  <Link to="/privacy" className="hover:text-white transition-colors">Data Sovereignity</Link>
                  <Link to="/terms" className="hover:text-white transition-colors">Institutional Terms</Link>
                </nav>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Channel Matrix</h4>
                 <div className="flex flex-col gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <p>X-Oversight: CE-88</p>
                    <p>Auth-Pipe: V-Layer 12</p>
                 </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
               <p className="font-mono text-[8px] text-white/10 tracking-[0.5em] uppercase">
                 © {new Date().getFullYear()} CIVIC_EYE_INFRASTRUCTURE // GOVERNMENTAL_ELITE_STANDARDS
               </p>
               <div className="flex gap-12 opacity-5 grayscale invert brightness-0">
                  <Globe size={20} />
                  <Database size={20} />
                  <Scale size={20} />
               </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};