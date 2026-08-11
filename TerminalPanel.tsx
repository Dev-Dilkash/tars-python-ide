import React, { useState } from 'react';
import { Terminal, Send, Trash2, Clock, CheckCircle2, AlertTriangle, CornerDownLeft } from 'lucide-react';
import { ExecutionResult, AppTheme } from '../types';

interface TerminalPanelProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  onSendInput: (inputVal: string) => void;
  onClearTerminal: () => void;
  theme: AppTheme;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  executionResult,
  isRunning,
  onSendInput,
  onClearTerminal,
  theme,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && inputValue !== '') return;
    onSendInput(inputValue);
    setInputValue('');
  };

  const getThemeTerminalColors = () => {
    switch (theme) {
      case 'matrix':
        return 'text-[#00FF66] border-[#00FF66]/20 bg-[#050A05]';
      case 'cyberpunk':
        return 'text-[#00F0FF] border-[#FF007F]/20 bg-[#090814]';
      case 'midnight':
        return 'text-emerald-400 border-slate-700 bg-[#0B0F19]';
      case 'cyber-red':
        return 'text-rose-300 border-rose-900/40 bg-[#080204]';
      case 'nord':
        return 'text-[#88C0D0] border-[#3B4252] bg-[#1E222A]';
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border backdrop-blur-md overflow-hidden shadow-2xl transition-colors duration-300 ${getThemeTerminalColors()}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold tracking-wider uppercase text-slate-300">
            Interactive Output & Stdin
          </span>
          {executionResult?.executionTimeMs !== undefined && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              {executionResult.executionTimeMs}ms
            </span>
          )}
        </div>

        <button
          onClick={onClearTerminal}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          title="Clear Terminal Output"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Output Body */}
      <div className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto space-y-2 whitespace-pre-wrap leading-relaxed select-text">
        {isRunning && (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            Executing Python script...
          </div>
        )}

        {!isRunning && !executionResult && (
          <div className="text-slate-500 italic">
            Console ready. Click <span className="text-emerald-400 font-bold">Run Code</span> or press <span className="text-amber-400 font-bold">Ctrl+Enter</span> to execute your Python script.
          </div>
        )}

        {/* Stdout Output */}
        {executionResult?.stdout && (
          <div className="text-slate-200">{executionResult.stdout}</div>
        )}

        {/* Interactive Input Prompt required state */}
        {executionResult?.waitingForInput && (
          <div className="my-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              [INPUT REQUIRED]: {executionResult.inputPrompt || 'Enter input value:'}
            </div>
            <form onSubmit={handleSubmitInput} className="flex gap-2 mt-2">
              <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your response here..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-amber-500/40 text-amber-200 focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 flex items-center gap-1 transition-all"
              >
                Submit <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Stderr or Python Error Output */}
        {(executionResult?.stderr || executionResult?.error) && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300">
            <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
              Python Traceback / Execution Error:
            </div>
            <pre className="text-xs text-rose-200 font-mono whitespace-pre-wrap">
              {executionResult.error || executionResult.stderr}
            </pre>
          </div>
        )}

        {/* Success Execution Status */}
        {executionResult && !executionResult.error && !executionResult.waitingForInput && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 pt-2 border-t border-white/5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Process finished with return code 0 ({executionResult.executionTimeMs}ms)
          </div>
        )}
      </div>

      {/* Optional Quick Interactive Stdin Input Bar at bottom if process is alive or student wants to pre-set inputs */}
      <div className="px-4 py-2 bg-black/40 border-t border-white/10 flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400">stdin:</span>
        <form onSubmit={handleSubmitInput} className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pre-enter input line for code (or answer prompt above)..."
            className="flex-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
          />
          <button
            type="submit"
            className="p-1 px-2.5 rounded bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1 transition-all"
          >
            Send <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
