import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Info, 
  ShieldCheck, 
  FileText, 
  Sliders, 
  Download,
  Bot,
  Palette
} from 'lucide-react';
import { AppTheme, MainTab, TarsSettings } from '../types';
import { ThemeModal } from './ThemeModal';

interface HeaderProps {
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  tarsSettings: TarsSettings;
  openTarsSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  setTheme,
  activeTab,
  setActiveTab,
  tarsSettings,
  openTarsSettings,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const getThemeAccentClass = () => {
    switch (currentTheme) {
      case 'matrix':
        return 'text-[#00FF66] border-[#00FF66]/30 bg-[#00FF66]/10';
      case 'cyberpunk':
        return 'text-[#FF007F] border-[#FF007F]/30 bg-[#FF007F]/10';
      case 'midnight':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'cyber-red':
        return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
      case 'nord':
        return 'text-[#88C0D0] border-[#88C0D0]/30 bg-[#88C0D0]/10';
    }
  };

  const getThemeLabel = (t: AppTheme) => {
    switch (t) {
      case 'matrix':
        return 'Matrix';
      case 'cyberpunk':
        return 'Cyber';
      case 'midnight':
        return 'Midnight';
      case 'cyber-red':
        return 'Cyber Red';
      case 'nord':
        return 'Nord Arctic';
    }
  };

  const getThemeDotBg = (t: AppTheme) => {
    switch (t) {
      case 'matrix':
        return 'bg-[#00FF66] shadow-[#00FF66]/60';
      case 'cyberpunk':
        return 'bg-[#FF007F] shadow-[#FF007F]/60';
      case 'midnight':
        return 'bg-sky-400 shadow-sky-400/60';
      case 'cyber-red':
        return 'bg-rose-500 shadow-rose-500/60';
      case 'nord':
        return 'bg-[#88C0D0] shadow-[#88C0D0]/60';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md bg-black/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className={`p-1.5 sm:p-2 rounded-xl border flex items-center justify-center transition-all ${getThemeAccentClass()}`}>
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-lg tracking-wider font-mono uppercase flex items-center gap-1">
                TARS <span className="text-[10px] sm:text-xs font-normal px-1.5 py-0.5 rounded-full border border-white/10 bg-white/5 font-sans">v3.11</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">Student IDE • Dev: Dilkash</p>
          </div>
        </div>

        {/* Center Nav Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-white/15 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'snippets'
                ? 'bg-white/15 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Snippets
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-white/15 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-white/15 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-white/15 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms
          </button>
        </nav>

        {/* Right Tools: Theme Switcher + TARS Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* TARS Parameter Pill */}
          <button
            onClick={openTarsSettings}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-mono"
            title="Configure TARS Humor, Honesty, and Sarcasm settings"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-slate-300">TARS:</span>
            <span className="text-amber-400 font-bold">{tarsSettings.humor}%</span>
          </button>

          {/* Single Glassmorphism Theme Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-xs font-mono font-bold text-slate-100 flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Select App Theme"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className={`w-2 h-2 rounded-full shadow-sm ${getThemeDotBg(currentTheme)}`}></span>
            <span className="hidden sm:inline">{getThemeLabel(currentTheme)}</span>
          </button>

          {/* Glassmorphism Popup Theme Modal */}
          <ThemeModal
            isOpen={isThemeModalOpen}
            onClose={() => setIsThemeModalOpen(false)}
            currentTheme={currentTheme}
            setTheme={setTheme}
          />

          {/* PWA Install Button */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-white/10 py-1 px-1 bg-black/60 text-[11px] overflow-x-auto font-mono">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${activeTab === 'editor' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400'}`}
        >
          <Terminal className="w-3.5 h-3.5" /> Editor
        </button>
        <button
          onClick={() => setActiveTab('snippets')}
          className={`flex items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${activeTab === 'snippets' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400'}`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Snippets
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${activeTab === 'about' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400'}`}
        >
          <Info className="w-3.5 h-3.5" /> About
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${activeTab === 'privacy' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${activeTab === 'terms' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400'}`}
        >
          <FileText className="w-3.5 h-3.5" /> Terms
        </button>
      </div>
    </header>
  );
};
