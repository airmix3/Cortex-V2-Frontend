'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, MessageSquare, Zap, FileText, Search } from 'lucide-react';
import { ChatMode } from './chat-data';

const modes: { key: ChatMode; label: string; icon: React.ElementType }[] = [
  { key: 'chat', label: 'Chat', icon: MessageSquare },
  { key: 'act', label: 'Act', icon: Zap },
  { key: 'brief', label: 'Brief', icon: FileText },
  { key: 'investigate', label: 'Investigate', icon: Search },
];

export default function ChatInput({
  onSend,
  mode,
  onModeChange,
}: {
  onSend: (text: string) => void;
  mode: ChatMode;
  onModeChange: (m: ChatMode) => void;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 px-6 pb-5 pt-2">
      <div className="max-w-3xl mx-auto">
        {/* Mode selector */}
        <div className="flex items-center gap-1 mb-2">
          {modes.map((m) => {
            const active = mode === m.key;
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => onModeChange(m.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  active ? 'text-amber-300' : 'text-slate-500 hover:text-slate-300'
                }`}
                style={active ? { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' } : { background: 'transparent', border: '1px solid transparent' }}
              >
                <Icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Input field */}
        <div
          className="flex items-end gap-2 rounded-2xl px-4 py-3 transition-all focus-within:shadow-[0_0_0_1px_rgba(245,158,11,0.4),0_0_16px_rgba(245,158,11,0.08)]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'act' ? 'Tell Tamir what to do...' : mode === 'brief' ? 'Ask for a briefing...' : mode === 'investigate' ? 'What should I look into?' : 'Message Tamir...'}
            rows={1}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none max-h-32"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
          />
          <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
            <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg">
              <Mic className="w-4 h-4" />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!value.trim()}
              className="p-2 rounded-xl transition-all disabled:opacity-30"
              style={{ background: value.trim() ? 'rgba(245,158,11,0.85)' : 'rgba(255,255,255,0.06)' }}
            >
              <Send className="w-4 h-4" style={{ color: value.trim() ? '#0a0f1a' : '#64748b' }} />
            </motion.button>
          </div>
        </div>

        {/* Context line */}
        <div className="text-[11px] text-slate-600 mt-2 text-center">
          Tamir has context on 9 missions, 4 escalations, 12 vault entries
        </div>
      </div>
    </div>
  );
}
