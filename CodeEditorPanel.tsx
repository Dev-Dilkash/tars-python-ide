import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, Copy, Download, Trash2, Code2, Sparkles, Check, CornerDownRight, Keyboard } from 'lucide-react';
import { AppTheme } from '../types';

interface CodeEditorPanelProps {
  code: string;
  setCode: (code: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  theme: AppTheme;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  setCode,
  onRunCode,
  isRunning,
  theme,
}) => {
  const [copied, setCopied] = React.useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Custom Monaco Themes for Hacker Matrix, Cyberpunk, and Midnight
    monaco.editor.defineTheme('matrix-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: '00FF66', background: '050A05' },
        { token: 'comment', foreground: '22C55E', fontStyle: 'italic' },
        { token: 'keyword', foreground: '4ADE80', fontStyle: 'bold' },
        { token: 'string', foreground: 'A7F3D0' },
        { token: 'number', foreground: '10B981' },
      ],
      colors: {
        'editor.background': '#050A05',
        'editor.foreground': '#00FF66',
        'editorCursor.foreground': '#00FF66',
        'editor.lineHighlightBackground': '#0D1A0D',
        'editorLineNumber.foreground': '#15803D',
        'editorLineNumber.activeForeground': '#00FF66',
        'editor.selectionBackground': '#16653450',
      },
    });

    monaco.editor.defineTheme('cyberpunk-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'F472B6', background: '090814' },
        { token: 'comment', foreground: '38BDF8', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF007F', fontStyle: 'bold' },
        { token: 'string', foreground: '00F0FF' },
        { token: 'number', foreground: 'F43F5E' },
      ],
      colors: {
        'editor.background': '#090814',
        'editor.foreground': '#F472B6',
        'editorCursor.foreground': '#00F0FF',
        'editor.lineHighlightBackground': '#1A1530',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#00F0FF',
        'editor.selectionBackground': '#FF007F40',
      },
    });

    monaco.editor.defineTheme('midnight-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
        { token: 'keyword', foreground: '38BDF8', fontStyle: 'bold' },
        { token: 'string', foreground: '34D399' },
        { token: 'number', foreground: 'F43F5E' },
      ],
      colors: {
        'editor.background': '#0F172A',
        'editor.foreground': '#F8FAFC',
        'editorCursor.foreground': '#38BDF8',
        'editor.lineHighlightBackground': '#1E293B',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#38BDF8',
      },
    });

    monaco.editor.defineTheme('cyber-red-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'F87171', background: '080204' },
        { token: 'comment', foreground: '78716C', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'EF4444', fontStyle: 'bold' },
        { token: 'string', foreground: 'FBBF24' },
        { token: 'number', foreground: 'F87171' },
      ],
      colors: {
        'editor.background': '#080204',
        'editor.foreground': '#FCA5A5',
        'editorCursor.foreground': '#EF4444',
        'editor.lineHighlightBackground': '#1F0B10',
        'editorLineNumber.foreground': '#7f1d1d',
        'editorLineNumber.activeForeground': '#EF4444',
        'editor.selectionBackground': '#991B1B50',
      },
    });

    monaco.editor.defineTheme('nord-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'D8DEE9', background: '1E222A' },
        { token: 'comment', foreground: '616E88', fontStyle: 'italic' },
        { token: 'keyword', foreground: '81A1C1', fontStyle: 'bold' },
        { token: 'string', foreground: 'A3BE8C' },
        { token: 'number', foreground: 'B48EAD' },
      ],
      colors: {
        'editor.background': '#1E222A',
        'editor.foreground': '#ECEFF4',
        'editorCursor.foreground': '#88C0D0',
        'editor.lineHighlightBackground': '#2E3440',
        'editorLineNumber.foreground': '#4C566A',
        'editorLineNumber.activeForeground': '#88C0D0',
        'editor.selectionBackground': '#434C5E80',
      },
    });

    // Add keyboard shortcut: Ctrl+Enter or Cmd+Enter runs code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });
  };

  const getMonacoThemeName = () => {
    switch (theme) {
      case 'matrix':
        return 'matrix-theme';
      case 'cyberpunk':
        return 'cyberpunk-theme';
      case 'midnight':
        return 'midnight-theme';
      case 'cyber-red':
        return 'cyber-red-theme';
      case 'nord':
        return 'nord-theme';
      default:
        return 'vs-dark';
    }
  };

  const insertSnippet = (snippet: string, cursorOffsetFromEnd = 0) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('quick-toolbar', [
          {
            range: selection,
            text: snippet,
            forceMoveMarkers: true,
          },
        ]);
        if (cursorOffsetFromEnd > 0) {
          const position = editor.getPosition();
          if (position) {
            editor.setPosition({
              lineNumber: position.lineNumber,
              column: Math.max(1, position.column - cursorOffsetFromEnd),
            });
          }
        }
        editor.focus();
        return;
      }
    }
    setCode(code + snippet);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getRunButtonThemeStyles = () => {
    switch (theme) {
      case 'matrix':
        return 'bg-[#00FF66] text-black hover:bg-[#10B981] shadow-[#00FF66]/20';
      case 'cyberpunk':
        return 'bg-[#FF007F] text-white hover:bg-[#D90368] shadow-[#FF007F]/30';
      case 'midnight':
        return 'bg-sky-500 text-black hover:bg-sky-400 shadow-sky-500/20';
      case 'cyber-red':
        return 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30';
      case 'nord':
        return 'bg-[#88C0D0] text-[#2E3440] hover:bg-[#81A1C1] shadow-[#88C0D0]/30';
    }
  };

  const getToolbarKeyStyles = (isMacro = false) => {
    switch (theme) {
      case 'matrix':
        return isMacro
          ? 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/40 hover:bg-[#00FF66]/30 font-bold'
          : 'bg-[#00FF66]/10 text-emerald-300 border-[#00FF66]/20 hover:bg-[#00FF66]/20 font-mono';
      case 'cyberpunk':
        return isMacro
          ? 'bg-[#FF007F]/25 text-[#00F0FF] border-[#FF007F]/50 hover:bg-[#FF007F]/40 font-bold'
          : 'bg-[#00F0FF]/10 text-pink-300 border-[#00F0FF]/20 hover:bg-[#00F0FF]/20 font-mono';
      case 'cyber-red':
        return isMacro
          ? 'bg-rose-600/30 text-rose-300 border-rose-500/50 hover:bg-rose-600/40 font-bold'
          : 'bg-rose-950/40 text-rose-200 border-rose-500/30 hover:bg-rose-900/40 font-mono';
      case 'nord':
        return isMacro
          ? 'bg-[#88C0D0]/25 text-[#88C0D0] border-[#88C0D0]/40 hover:bg-[#88C0D0]/35 font-bold'
          : 'bg-[#88C0D0]/10 text-[#D8DEE9] border-[#88C0D0]/20 hover:bg-[#88C0D0]/20 font-mono';
      case 'midnight':
      default:
        return isMacro
          ? 'bg-sky-500/25 text-sky-200 border-sky-500/40 hover:bg-sky-500/35 font-bold'
          : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20 font-mono';
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Editor Toolbar Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            main.py
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={handleCopy}
            className="p-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
            title="Copy Python code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
            title="Download .py file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setCode('# New Python Script\n')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-all text-xs"
            title="Clear editor code"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className={`px-3 sm:px-4 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 shrink-0 ${getRunButtonThemeStyles()}`}
          >
            {isRunning ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Executing...</span>
                <span className="sm:hidden">Run...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Code</span>
                <span className="hidden sm:inline font-normal text-[10px] opacity-75">(Ctrl+Enter)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Mobile Coding Toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 border-b border-white/10 overflow-x-auto scrollbar-none select-none shrink-0 text-xs">
        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider pr-1 shrink-0 flex items-center gap-1">
          <Keyboard className="w-3 h-3 text-amber-400" /> Quick Keys:
        </span>

        {/* Tab / Indent */}
        <button
          onClick={() => insertSnippet('    ')}
          className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles(true)}`}
          title="Indent (4 Spaces)"
        >
          <CornerDownRight className="w-3 h-3" />
          <span>Tab</span>
        </button>

        {/* Essential Symbols */}
        <button
          onClick={() => insertSnippet(':')}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          :
        </button>
        <button
          onClick={() => insertSnippet(' = ')}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          =
        </button>
        <button
          onClick={() => insertSnippet('""', 1)}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          " "
        </button>
        <button
          onClick={() => insertSnippet("''", 1)}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          ' '
        </button>
        <button
          onClick={() => insertSnippet('()', 1)}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          ()
        </button>
        <button
          onClick={() => insertSnippet('[]', 1)}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          []
        </button>
        <button
          onClick={() => insertSnippet('{}', 1)}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          {}
        </button>
        <button
          onClick={() => insertSnippet('_')}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles()}`}
        >
          _
        </button>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-white/20 mx-1 shrink-0" />

        {/* Quick Macros */}
        <button
          onClick={() => insertSnippet('print()', 1)}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles(true)}`}
        >
          print()
        </button>
        <button
          onClick={() => insertSnippet('def ')}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles(true)}`}
        >
          def
        </button>
        <button
          onClick={() => insertSnippet('if ')}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles(true)}`}
        >
          if
        </button>
        <button
          onClick={() => insertSnippet('else:')}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles(true)}`}
        >
          else:
        </button>
        <button
          onClick={() => insertSnippet('for ')}
          className={`px-2.5 py-1 rounded-lg border text-xs transition-all shrink-0 active:scale-95 ${getToolbarKeyStyles(true)}`}
        >
          for
        </button>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="flex-1 min-h-[280px] sm:min-h-[340px] relative">
        <Editor
          height="100%"
          defaultLanguage="python"
          language="python"
          theme={getMonacoThemeName()}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
            lineNumbersMinChars: 3,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            suggestOnTriggerCharacters: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};

