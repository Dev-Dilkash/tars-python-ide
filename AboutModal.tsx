import React from 'react';
import { Bot, Code2, Lock, Sparkles, User, ExternalLink } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const developerProfile = {
    name: 'Dilkash',
    role: 'Founder',
    github: 'https://github.com/Dev-Dilkash',
    previousProject: 'https://dev-dilkash.github.io/BANKNOTE-HY20/',
    bio: '2nd-year student pursuing a Diploma in Computer Science & Engineering at MANUU, Hyderabad. Hailing from Buxar, Bihar.',
    version: '3.0.0 (Locked Developer Edition)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0F172A] border border-white/10 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-sm sm:text-base text-slate-100">
                About TARS Python IDE
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Student Coding Platform with Hinglish TARS AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono transition-all"
          >
            Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Mission & Overview */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" /> Platform Highlights
            </h3>
            <p className="text-slate-200">
              TARS Python IDE is a mobile-first, 100% offline-ready Python learning platform designed specifically for students.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong className="text-emerald-400">100% Client-Side Python Runtime:</strong> Code runs inside WebAssembly (Pyodide) directly in your browser. Print statements, loops, and interactive <code className="bg-black/50 px-1 rounded text-amber-300">input()</code> functions work seamlessly offline.</li>
              <li><strong className="text-amber-400">TARS Hinglish AI Debugger:</strong> When code throws an error, TARS analyzes the bug and responds in witty, sarcastic student-friendly Hinglish.</li>
              <li><strong className="text-sky-400">3 Cyberpunk Themes:</strong> Switch between Hacker Matrix, Cyberpunk Neon, and Midnight Obsidian modes.</li>
              <li><strong className="text-rose-400">PWA Offline App:</strong> Installable on mobile phones, tablets, and laptops as a standalone application.</li>
            </ul>
          </div>

          {/* Developer Details Section - LOCKED TO DILKASH */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-black border border-emerald-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="font-mono font-bold text-xs sm:text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" /> Developer Details
              </h3>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                <Lock className="w-3 h-3" /> VERIFIED DEVELOPER PROFILE (LOCKED)
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-mono">Lead Developer:</span>
                <span className="font-extrabold text-emerald-300 text-sm font-mono tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> {developerProfile.name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-mono">Role & Position:</span>
                <span className="text-slate-200 font-medium">{developerProfile.role}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-mono">Organization / GitHub:</span>
                <a
                  href={developerProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-xs"
                >
                  {developerProfile.github} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-mono">Previous Project:</span>
                <a
                  href={developerProfile.previousProject}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  {developerProfile.previousProject} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 font-mono block mb-1">Developer Bio:</span>
                <p className="text-slate-300 italic bg-black/40 p-3 rounded-xl border border-white/5">
                  "{developerProfile.bio}"
                </p>
              </div>
            </div>
          </div>

          {/* Version Badge */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">Platform Version:</span>
            <span className="text-amber-400 font-bold">{developerProfile.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
