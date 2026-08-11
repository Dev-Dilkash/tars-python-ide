import React, { useState } from 'react';
import { 
  Bot, 
  Flame, 
  Lightbulb, 
  MessageSquare, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Zap,
  Cpu
} from 'lucide-react';
import { TarsDebugResponse, ChatMessage, TarsSettings, AppTheme } from '../types';

interface TarsPanelProps {
  tarsDebug: TarsDebugResponse | null;
  isAnalyzing: boolean;
  repeatCount: number;
  tarsSettings: TarsSettings;
  setTarsSettings: (settings: TarsSettings) => void;
  openSettingsModal: () => void;
  currentCode: string;
  theme: AppTheme;
}

export const TarsPanel: React.FC<TarsPanelProps> = ({
  tarsDebug,
  isAnalyzing,
  repeatCount,
  tarsSettings,
  openSettingsModal,
  currentCode,
  theme,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'debugger' | 'chat'>('debugger');
  const [showTechnicalHint, setShowTechnicalHint] = useState(false);

  // TARS Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tars',
      text: "Haan bhai! Main TARS hoon. Sarcasm subroutine set at 85%. Apni Python doubt poochho ya fir code run karke galti suno!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatSending(true);

    try {
      const res = await fetch('/api/tars-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          code: currentCode,
          humor: tarsSettings.humor,
          honesty: tarsSettings.honesty,
          sarcasm: tarsSettings.sarcasm,
          chatHistory: chatMessages,
          customKeys: tarsSettings.customKeys || [],
        }),
      });

      if (!res.ok) throw new Error("Offline mode");

      const data = await res.json();
      const tarsReply = data.reply || "TARS bilkul shant hai.";

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tars',
          text: tarsReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tars',
          text: "Bhai, 100% offline mode active hai! TARS bol raha hai: Code run karo, agar galti hui toh direct Hinglish roast milega!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const getThemeAccentBorder = () => {
    switch (theme) {
      case 'matrix':
        return 'border-[#00FF66]/30 bg-[#050A05]';
      case 'cyberpunk':
        return 'border-[#FF007F]/30 bg-[#090814]';
      case 'midnight':
        return 'border-sky-500/30 bg-[#0F172A]';
      case 'cyber-red':
        return 'border-rose-600/30 bg-[#080204]';
      case 'nord':
        return 'border-[#88C0D0]/30 bg-[#1E222A]';
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border backdrop-blur-md overflow-hidden shadow-2xl transition-colors duration-300 ${getThemeAccentBorder()}`}>
      {/* TARS Status Header HUD - Mobile Responsive Wrap */}
      <div className="px-3 sm:px-4 py-2.5 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div>
            <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              TARS Debugger
              {repeatCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                  Repeat: {repeatCount}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className="text-amber-400 font-semibold">HUM: {tarsSettings.humor}%</span>
              <span>•</span>
              <span className="text-sky-400 font-semibold">HON: {tarsSettings.honesty}%</span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">SAR: {tarsSettings.sarcasm}%</span>
            </div>
          </div>
        </div>

        {/* Configure Sliders & SubTab Buttons */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={openSettingsModal}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-all text-xs"
            title="Adjust TARS Humor & Sarcasm Sliders"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveSubTab('debugger')}
              className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                activeSubTab === 'debugger' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" /> Roast
            </button>
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                activeSubTab === 'chat' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3" /> Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-sans text-xs sm:text-sm space-y-3 sm:space-y-4">
        {/* SUBTAB 1: DEBUGGER / HINGLISH ROAST CARD */}
        {activeSubTab === 'debugger' && (
          <div>
            {isAnalyzing && (
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-center space-y-3 animate-pulse">
                <Cpu className="w-7 h-7 mx-auto text-amber-400 animate-spin" />
                <p className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest">
                  TARS Analyzing Code Bug & Calibrating Hinglish Roast...
                </p>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}

            {!isAnalyzing && !tarsDebug && (
              <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-center space-y-2">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-slate-500 opacity-60" />
                <h3 className="font-mono text-xs font-bold uppercase text-slate-300">TARS Sensors Nominal</h3>
                <p className="text-xs max-w-sm mx-auto text-slate-400">
                  Run your Python script above! If Python throws an error, TARS will intercept it and roast your code in witty student-friendly Hinglish.
                </p>
              </div>
            )}

            {!isAnalyzing && tarsDebug && (
              <div className="space-y-3 sm:space-y-4">
                {/* TARS Status Quote Badge */}
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center justify-between flex-wrap gap-1">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {tarsDebug.tarsStatusQuote}
                  </span>
                  <span className="text-[10px] opacity-75">{tarsDebug.humorScore}</span>
                </div>

                {/* TARS Hinglish Roast Box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 relative overflow-hidden shadow-xl break-words">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0 mt-0.5">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-mono text-[11px] sm:text-xs font-bold uppercase text-rose-400 tracking-wider">
                        TARS Hinglish Roast:
                      </h4>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-100 whitespace-pre-wrap">
                        "{tarsDebug.roast}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Educational Technical Hint Toggle Button */}
                <div className="rounded-xl border border-white/10 overflow-hidden bg-black/30">
                  <button
                    onClick={() => setShowTechnicalHint(!showTechnicalHint)}
                    className="w-full px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-mono font-semibold text-emerald-400 flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2 text-left">
                      <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                      {showTechnicalHint ? 'Hide Hinglish Solution Hint' : 'Show Educational Fix & Hinglish Solution Hint'}
                    </span>
                    {showTechnicalHint ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </button>

                  {showTechnicalHint && (
                    <div className="p-3 sm:p-4 text-xs font-mono text-slate-200 border-t border-white/10 bg-emerald-950/20 space-y-2 break-words">
                      <p className="text-emerald-300 font-semibold uppercase text-[11px] tracking-wider">
                        ✔ How to fix this bug in Python:
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {tarsDebug.technicalHint}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: TALK TO TARS INTERACTIVE CHAT */}
        {activeSubTab === 'chat' && (
          <div className="flex flex-col h-full min-h-[260px]">
            {/* Chat History */}
            <div className="flex-1 space-y-2.5 overflow-y-auto mb-2 max-h-[260px] pr-1">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 text-xs ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'tars' && (
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-2.5 sm:p-3 rounded-2xl max-w-[90%] space-y-1 break-words ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-black font-medium'
                        : 'bg-white/10 border border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 font-mono">
                      <span>{msg.sender === 'user' ? 'Student' : 'TARS'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isChatSending && (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono italic animate-pulse">
                  <Bot className="w-3.5 h-3.5 animate-spin" /> TARS soch raha hai...
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask TARS in Hinglish..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono min-w-0"
              />
              <button
                type="submit"
                disabled={isChatSending}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
              >
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
