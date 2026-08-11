import React, { useState, useEffect } from 'react';
import { X, Sliders, Sparkles, RotateCcw, Cpu, Key, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { TarsSettings } from '../types';

interface TarsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TarsSettings;
  setSettings: (settings: TarsSettings) => void;
}

interface LoadBalancerStatus {
  totalKeysConfigured: number;
  currentRoundRobinIndex: number;
  totalRequestsHandled: number;
  loadBalancerStatus: string;
}

export const TarsSettingsModal: React.FC<TarsSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
}) => {
  const [newKeyInput, setNewKeyInput] = useState('');
  const [lbStatus, setLbStatus] = useState<LoadBalancerStatus | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/tars-keys-status')
        .then((res) => res.json())
        .then((data) => setLbStatus(data))
        .catch((err) => console.warn('Could not fetch Load Balancer status:', err));
    }
  }, [isOpen, settings.customKeys]);

  if (!isOpen) return null;

  const handleAddKey = () => {
    const trimmed = newKeyInput.trim();
    if (!trimmed) return;

    const existingKeys = settings.customKeys || [];
    if (!existingKeys.includes(trimmed)) {
      setSettings({
        ...settings,
        customKeys: [...existingKeys, trimmed],
      });
    }
    setNewKeyInput('');
  };

  const handleRemoveKey = (keyToRemove: string) => {
    const existingKeys = settings.customKeys || [];
    setSettings({
      ...settings,
      customKeys: existingKeys.filter((k) => k !== keyToRemove),
    });
  };

  const handleReset = () => {
    setSettings({ humor: 75, honesty: 90, sarcasm: 85, customKeys: [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg p-5 sm:p-6 rounded-3xl bg-[#111827] border border-amber-500/30 text-slate-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-base uppercase text-slate-100">
                TARS Cue Parameters & Load Balancer
              </h3>
              <p className="text-xs text-slate-400">Personality & Multi-API Key Splitter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Load Balancer Monitor Badge */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-200">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" /> Multi-API Key Load Balancer:
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
              {lbStatus ? lbStatus.loadBalancerStatus : 'ACTIVE'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 text-slate-300">
            <div className="bg-black/40 p-2 rounded-xl border border-white/5 text-center">
              <span className="text-slate-400 block text-[10px]">Pool Keys</span>
              <strong className="text-amber-400 font-bold text-sm">
                {(lbStatus?.totalKeysConfigured || 0) + (settings.customKeys?.length || 0)}
              </strong>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-white/5 text-center">
              <span className="text-slate-400 block text-[10px]">Current Index</span>
              <strong className="text-sky-400 font-bold text-sm">
                #{lbStatus?.currentRoundRobinIndex ?? 0}
              </strong>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-white/5 text-center">
              <span className="text-slate-400 block text-[10px]">Total Handled</span>
              <strong className="text-emerald-400 font-bold text-sm">
                {lbStatus?.totalRequestsHandled ?? 0}
              </strong>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Requests automatically rotate round-robin across available keys. If limits are reached, TARS instantly falls back to local offline Hinglish dictionary!
          </p>
        </div>

        {/* Custom API Key Input for Round Robin */}
        <div className="space-y-2 font-mono text-xs">
          <label className="text-slate-300 font-bold flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-400" /> Backup API Keys Pool (Round-Robin Split)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={newKeyInput}
              onChange={(e) => setNewKeyInput(e.target.value)}
              placeholder="Paste backup Gemini API key..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="button"
              onClick={handleAddKey}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* List of custom keys */}
          {settings.customKeys && settings.customKeys.length > 0 && (
            <div className="space-y-1.5 pt-2">
              {settings.customKeys.map((key, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Key #{idx + 1}: {key.slice(0, 6)}...{key.slice(-4)}
                  </span>
                  <button
                    onClick={() => handleRemoveKey(key)}
                    className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sliders */}
        <div className="space-y-4 font-mono text-xs border-t border-white/10 pt-4">
          {/* Humor Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Humor Setting
              </label>
              <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {settings.humor}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.humor}
              onChange={(e) => setSettings({ ...settings, humor: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-slate-800 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Honesty Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-400" /> Brutal Honesty
              </label>
              <span className="text-sky-400 font-bold text-xs bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                {settings.honesty}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.honesty}
              onChange={(e) => setSettings({ ...settings, honesty: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-slate-800 accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Sarcasm Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-rose-400" /> Sarcasm Subroutine
              </label>
              <span className="text-rose-400 font-bold text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                {settings.sarcasm}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sarcasm}
              onChange={(e) => setSettings({ ...settings, sarcasm: Number(e.target.value) })}
              className="w-full h-2 rounded-lg bg-slate-800 accent-rose-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono transition-all shadow-lg shadow-amber-500/20"
          >
            Save Parameters
          </button>
        </div>
      </div>
    </div>
  );
};
