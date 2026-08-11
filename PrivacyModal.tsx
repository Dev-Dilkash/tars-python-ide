import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#0F172A] border border-white/10 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-base text-slate-100">
                Privacy Policy
              </h2>
              <p className="text-xs text-slate-400">Student Data Security & Sandbox Guarantees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono transition-all"
          >
            Close
          </button>
        </div>

        {/* Policy Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2 font-mono">
            <Lock className="w-4 h-4 shrink-0" />
            <span>100% Client-Side Python Sandbox Execution. Your code never leaves your browser.</span>
          </div>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
              1. Information Collection
            </h3>
            <p>
              TARS Python IDE is engineered for privacy. Python source code entered in the Monaco Editor is executed entirely inside your local browser instance via Pyodide WebAssembly. We do not transmit, log, or store your raw source code on remote databases.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
              2. TARS AI Analysis Telemetry
            </h3>
            <p>
              When your Python code triggers an execution exception, the error traceback and code context are evaluated by our AI Debugger endpoint powered by Gemini API strictly for generating the TARS roast and technical educational solution. Data sent is ephemeral and discarded immediately after generating response parameters.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
              3. Local Storage & Preferences
            </h3>
            <p>
              Your theme choices (Matrix, Cyberpunk, Midnight), TARS parameter settings (Humor, Honesty, Sarcasm), and current code draft are stored in your browser's local storage. You can clear this data at any time by clearing site data in your browser.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
              4. Commercial-Grade Compliance
            </h3>
            <p>
              We comply with educational privacy standards. No personal identifying information (PII) is sold, shared, or exploited for targeted advertising.
            </p>
          </section>

          <div className="pt-4 border-t border-white/10 text-slate-400 text-[11px] font-mono flex items-center justify-between">
            <span>Last Updated: August 2026</span>
            <span className="text-emerald-400 font-bold">STATUS: COMPLIANT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
