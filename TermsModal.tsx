import React from 'react';
import { Scale, ShieldCheck, CheckCircle2, AlertCircle, BookOpen, Lock } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-[#0F172A] border border-white/10 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-sm sm:text-base text-slate-100">
                Terms & Conditions
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Student & Educational Use Policy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono transition-all"
          >
            Close
          </button>
        </div>

        {/* Terms Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Key Highlight Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5 font-mono">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-200">Educational & Student Learning Platform</span>
              <span>This software is built purely for learning Python programming safely in a sandboxed browser environment.</span>
            </div>
          </div>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1. Educational Purpose & Intended Use
            </h3>
            <p>
              TARS Python IDE is designed as an interactive educational environment for students, self-learners, and programming enthusiasts to write, execute, and debug Python code. The platform provides real-time WebAssembly Python execution and AI-assisted debugging feedback.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-400" /> 2. Local Browser Sandbox & Execution Security
            </h3>
            <p>
              All Python scripts executed in the editor run strictly within a sandboxed WebAssembly (Pyodide) container inside your browser. No Python user code is saved or executed on remote server infrastructure, ensuring total privacy and safe execution.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> 3. User Responsibility & Code Logic
            </h3>
            <p>
              Users are solely responsible for the code logic, algorithms, and inputs entered into the IDE. While TARS provides helpful error analysis and Hinglish debugging feedback, students are encouraged to read Python tracebacks and independently verify their code correctness.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" /> 4. Prohibition of Platform Misuse
            </h3>
            <p>
              Misuse of the platform—including intentional attempts to crash browser tabs via infinite allocation loops, execute automated browser exploits, or tamper with system assets—is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" /> 5. TARS Persona Disclaimer
            </h3>
            <p>
              The TARS AI Debugger features a playful, sarcastic "Hinglish" personality mode created for motivational roasting and entertaining student feedback. Humor settings can be adjusted or turned down at any time using the TARS parameters menu.
            </p>
          </section>

          <div className="pt-4 border-t border-white/10 text-slate-400 text-[11px] font-mono flex items-center justify-between">
            <span>Developer: Dilkash</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Policy Active & Enforced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
