import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeEditorPanel } from './components/CodeEditorPanel';
import { TerminalPanel } from './components/TerminalPanel';
import { TarsPanel } from './components/TarsPanel';
import { TarsSettingsModal } from './components/TarsSettingsModal';
import { SnippetsModal } from './components/SnippetsModal';
import { AboutModal } from './components/AboutModal';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';

import { AppTheme, MainTab, TarsSettings, ExecutionResult, TarsDebugResponse, CodeSnippet } from './types';
import { runPythonCode } from './services/pyodideRunner';
import { generateLocalHinglishRoast } from './services/tarsEngine';
import { CODE_SNIPPETS } from './data/snippets';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('tars_ide_theme') as AppTheme) || 'matrix';
  });

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<MainTab>('editor');

  // Code state
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('tars_ide_code') || CODE_SNIPPETS[0].code;
  });

  // User input lines queue for stdin input() handling
  const [userInputs, setUserInputs] = useState<string[]>([]);

  // Execution & Terminal State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // TARS Personality Settings State
  const [tarsSettings, setTarsSettings] = useState<TarsSettings>(() => {
    const saved = localStorage.getItem('tars_ide_settings');
    return saved ? JSON.parse(saved) : { humor: 75, honesty: 90, sarcasm: 85 };
  });

  // TARS Debugger State
  const [tarsDebug, setTarsDebug] = useState<TarsDebugResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [errorHistory, setErrorHistory] = useState<string[]>([]);

  // Modals state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('tars_ide_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tars_ide_code', code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem('tars_ide_settings', JSON.stringify(tarsSettings));
  }, [tarsSettings]);

  // Main Python Execution Handler (100% Client-Side WebAssembly via Pyodide)
  const handleExecuteCode = async (inputs: string[] = userInputs) => {
    setIsRunning(true);
    setTarsDebug(null);

    const result = await runPythonCode(code, inputs);
    setExecutionResult(result);
    setIsRunning(false);

    // If Python threw an error, trigger TARS Debug AI Analysis (Hinglish Roaster)
    if (result.error) {
      handleTarsDebugAnalysis(result.error);
    }
  };

  // TARS Hinglish AI Analysis Handler
  const handleTarsDebugAnalysis = async (errorTraceback: string) => {
    setIsAnalyzing(true);

    // Check if error is a repeat bug
    const lastError = errorHistory.length > 0 ? errorHistory[errorHistory.length - 1] : '';
    const errorType = errorTraceback.split('\n').pop() || '';
    let newRepeat = repeatCount;

    if (lastError && errorType && lastError.includes(errorType.slice(0, 15))) {
      newRepeat += 1;
    } else {
      newRepeat = 0;
    }
    setRepeatCount(newRepeat);
    setErrorHistory((prev) => [...prev, errorTraceback]);

    try {
      const res = await fetch('/api/tars-debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          errorTraceback,
          humor: tarsSettings.humor,
          honesty: tarsSettings.honesty,
          sarcasm: tarsSettings.sarcasm,
          repeatCount: newRepeat,
          errorHistory,
          customKeys: tarsSettings.customKeys || [],
        }),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data: TarsDebugResponse = await res.json();
      setTarsDebug(data);
    } catch (err) {
      console.warn('Backend API offline or unavailable. Using 100% Client-Side Hinglish TARS Engine:', err);
      // Fallback directly to 100% Client-Side Hinglish TARS Engine
      const localRoast = generateLocalHinglishRoast(code, errorTraceback, tarsSettings, newRepeat);
      setTarsDebug(localRoast);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Stdin interactive input submit
  const handleSendInput = (newInput: string) => {
    const updatedInputs = [...userInputs, newInput];
    setUserInputs(updatedInputs);
    handleExecuteCode(updatedInputs);
  };

  const handleClearTerminal = () => {
    setExecutionResult(null);
    setUserInputs([]);
    setTarsDebug(null);
  };

  const handleSelectSnippet = (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setUserInputs([]);
    setExecutionResult(null);
    setTarsDebug(null);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'matrix':
        return 'theme-matrix bg-[#050a05] text-[#00FF66] matrix-scanlines';
      case 'cyberpunk':
        return 'theme-cyberpunk bg-[#090814] text-slate-100';
      case 'midnight':
        return 'theme-midnight bg-[#0B0F19] text-slate-100';
      case 'cyber-red':
        return 'theme-cyber-red bg-[#080204] text-slate-100';
      case 'nord':
        return 'theme-nord bg-[#1E222A] text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300 ${getThemeClass()}`}>
      {/* Header */}
      <Header
        currentTheme={theme}
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tarsSettings={tarsSettings}
        openTarsSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Workspace Layout - Responsive Grid & Stack */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6">
        {activeTab === 'editor' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-0 lg:min-h-[680px]">
            {/* Left 7 Columns: Monaco Code Editor */}
            <div className="lg:col-span-7 flex flex-col h-[380px] sm:h-[460px] lg:h-auto min-h-[350px]">
              <CodeEditorPanel
                code={code}
                setCode={setCode}
                onRunCode={() => {
                  setUserInputs([]);
                  handleExecuteCode([]);
                }}
                isRunning={isRunning}
                theme={theme}
              />
            </div>

            {/* Right 5 Columns: Split vertically between Terminal & TARS AI Panel */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-6 h-auto min-h-[500px]">
              {/* Top: Terminal Output */}
              <div className="h-[240px] sm:h-[280px] lg:h-[300px]">
                <TerminalPanel
                  executionResult={executionResult}
                  isRunning={isRunning}
                  onSendInput={handleSendInput}
                  onClearTerminal={handleClearTerminal}
                  theme={theme}
                />
              </div>

              {/* Bottom: TARS AI Debugger & Chat Unit */}
              <div className="flex-1 min-h-[280px]">
                <TarsPanel
                  tarsDebug={tarsDebug}
                  isAnalyzing={isAnalyzing}
                  repeatCount={repeatCount}
                  tarsSettings={tarsSettings}
                  setTarsSettings={setTarsSettings}
                  openSettingsModal={() => setIsSettingsModalOpen(true)}
                  currentCode={code}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-3 text-center text-[11px] font-mono text-slate-500 bg-black/40 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TARS Python IDE • Created by <strong className="text-emerald-400">Dilkash</strong> • 100% Client-Side WebAssembly</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-300 transition-colors">About Developer</button>
            <button onClick={() => setActiveTab('privacy')} className="hover:text-slate-300 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveTab('terms')} className="hover:text-slate-300 transition-colors">Terms & Conditions</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TarsSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={tarsSettings}
        setSettings={setTarsSettings}
      />

      <SnippetsModal
        isOpen={activeTab === 'snippets'}
        onClose={() => setActiveTab('editor')}
        onSelectSnippet={handleSelectSnippet}
      />

      <AboutModal
        isOpen={activeTab === 'about'}
        onClose={() => setActiveTab('editor')}
      />

      <PrivacyModal
        isOpen={activeTab === 'privacy'}
        onClose={() => setActiveTab('editor')}
      />

      <TermsModal
        isOpen={activeTab === 'terms'}
        onClose={() => setActiveTab('editor')}
      />
    </div>
  );
}
