import React from 'react';
import { X, Palette, Check, Sparkles, Terminal, Cpu, Moon, Flame, Snowflake } from 'lucide-react';
import { AppTheme } from '../types';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  setTheme,
}) => {
  if (!isOpen) return null;

  const handleSelectTheme = (theme: AppTheme) => {
    setTheme(theme);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg p-5 sm:p-6 rounded-3xl bg-[#0b0f19]/80 border border-white/20 backdrop-blur-2xl text-slate-100 shadow-2xl shadow-black/90 space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Background Glow Spheres for Glassmorphism Depth */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FF007F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-base uppercase text-slate-100 tracking-wider">
                Select IDE Palette
              </h3>
              <p className="text-xs text-slate-400">Frosted Glass Theme Selector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Options Grid */}
        <div className="space-y-2.5 font-mono text-xs relative z-10">
          {/* Cyberpunk Neon */}
          <button
            onClick={() => handleSelectTheme('cyberpunk')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.98] ${
              currentTheme === 'cyberpunk'
                ? 'bg-[#FF007F]/15 border-[#FF007F] shadow-lg shadow-[#FF007F]/20 text-[#00F0FF]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#FF007F]/20 border border-[#FF007F]/30 text-[#FF007F]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  Cyberpunk Neon
                  <span className="w-2 h-2 rounded-full bg-[#FF007F] shadow-sm shadow-[#FF007F]/80 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Vivid hot pink & electric cyan on deep navy</p>
              </div>
            </div>
            {currentTheme === 'cyberpunk' && (
              <div className="p-1 rounded-full bg-[#FF007F] text-white shrink-0">
                <Check className="w-4 h-4 font-bold" />
              </div>
            )}
          </button>

          {/* Hacker Matrix */}
          <button
            onClick={() => handleSelectTheme('matrix')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.98] ${
              currentTheme === 'matrix'
                ? 'bg-[#00FF66]/15 border-[#00FF66] shadow-lg shadow-[#00FF66]/20 text-[#00FF66]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#00FF66]/20 border border-[#00FF66]/30 text-[#00FF66]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  Hacker Matrix
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-sm shadow-[#00FF66]/80 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">High-contrast green (#00FF66) with terminal lines</p>
              </div>
            </div>
            {currentTheme === 'matrix' && (
              <div className="p-1 rounded-full bg-[#00FF66] text-black shrink-0">
                <Check className="w-4 h-4 font-bold" />
              </div>
            )}
          </button>

          {/* Midnight Obsidian */}
          <button
            onClick={() => handleSelectTheme('midnight')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.98] ${
              currentTheme === 'midnight'
                ? 'bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-500/20 text-sky-400'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  Midnight Obsidian
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/80 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Clean dark slate canvas with indigo/azure highlights</p>
              </div>
            </div>
            {currentTheme === 'midnight' && (
              <div className="p-1 rounded-full bg-sky-400 text-black shrink-0">
                <Check className="w-4 h-4 font-bold" />
              </div>
            )}
          </button>

          {/* Cyber Red / Blood Moon */}
          <button
            onClick={() => handleSelectTheme('cyber-red')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.98] ${
              currentTheme === 'cyber-red'
                ? 'bg-rose-600/20 border-rose-500 shadow-lg shadow-rose-600/25 text-rose-400'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  Cyber Red / Blood Moon
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Deep crimson red & dark amber glow on pitch-black</p>
              </div>
            </div>
            {currentTheme === 'cyber-red' && (
              <div className="p-1 rounded-full bg-rose-500 text-white shrink-0">
                <Check className="w-4 h-4 font-bold" />
              </div>
            )}
          </button>

          {/* Nord Arctic */}
          <button
            onClick={() => handleSelectTheme('nord')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.98] ${
              currentTheme === 'nord'
                ? 'bg-[#88C0D0]/20 border-[#88C0D0] shadow-lg shadow-[#88C0D0]/20 text-[#88C0D0]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#88C0D0]/20 border border-[#88C0D0]/30 text-[#88C0D0]">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  Nord Arctic
                  <span className="w-2 h-2 rounded-full bg-[#88C0D0] shadow-sm shadow-[#88C0D0]/80 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">Cool polar night blue with arctic cyan accents</p>
              </div>
            </div>
            {currentTheme === 'nord' && (
              <div className="p-1 rounded-full bg-[#88C0D0] text-[#2E3440] shrink-0">
                <Check className="w-4 h-4 font-bold" />
              </div>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-white/10 text-center text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Theme choice is saved & applied across entire IDE</span>
        </div>
      </div>
    </div>
  );
};
