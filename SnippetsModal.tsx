import React, { useState } from 'react';
import { BookOpen, Code2, Play, Search, Tag, X } from 'lucide-react';
import { CODE_SNIPPETS } from '../data/snippets';
import { CodeSnippet } from '../types';

interface SnippetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnippet: (snippet: CodeSnippet) => void;
}

export const SnippetsModal: React.FC<SnippetsModalProps> = ({
  isOpen,
  onClose,
  onSelectSnippet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Basics', 'Control Flow', 'Functions', 'Algorithms'];

  const filteredSnippets = CODE_SNIPPETS.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-[#0F172A] border border-white/10 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-base text-slate-100">
                Python Practice Snippets & Challenges
              </h2>
              <p className="text-xs text-slate-400">Select a problem to load directly into Monaco Editor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-black/30 border-b border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search challenges..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-black font-bold shadow'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Snippets List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No challenges found.</div>
          ) : (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {snippet.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        snippet.level === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : snippet.level === 'Intermediate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {snippet.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{snippet.description}</p>
                </div>

                <button
                  onClick={() => {
                    onSelectSnippet(snippet);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Load Challenge
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
