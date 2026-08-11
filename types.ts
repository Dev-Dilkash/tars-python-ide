export type AppTheme = 'matrix' | 'cyberpunk' | 'midnight' | 'cyber-red' | 'nord';

export type MainTab = 'editor' | 'snippets' | 'about' | 'privacy' | 'terms';

export interface TarsSettings {
  humor: number;     // 0 to 100%
  honesty: number;   // 0 to 100%
  sarcasm: number;   // 0 to 100%
  customKeys?: string[];
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error?: string;
  executionTimeMs: number;
  waitingForInput?: boolean;
  inputPrompt?: string;
}

export interface TarsDebugResponse {
  roast: string;
  technicalHint: string;
  humorScore: string;
  tarsStatusQuote: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tars';
  text: string;
  timestamp: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Basics' | 'Control Flow' | 'Functions' | 'Data Structures' | 'Algorithms';
  description: string;
  code: string;
}

export interface DeveloperProfile {
  name: string;
  role: string;
  institution: string;
  bio: string;
  github: string;
  email: string;
  version: string;
}
