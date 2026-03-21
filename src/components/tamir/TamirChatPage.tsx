'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import ChatSidebar from './ChatSidebar';
import ChatThread from './ChatThread';
import ChatInput from './ChatInput';
import ContextPanel from './ContextPanel';
import { ChatMode, ChatThread as ChatThreadType, FullChatMessage, mainThread, olderThreads, simulateResponse } from './chat-data';

type EntityRef = { type: 'mission' | 'department' | 'escalation'; id: string };

function detectEntity(msg: FullChatMessage): EntityRef | null {
  if (msg.missionId) return { type: 'mission', id: msg.missionId };
  if (msg.departmentId) return { type: 'department', id: msg.departmentId };
  if (msg.escalationId) return { type: 'escalation', id: msg.escalationId };
  return null;
}

export default function TamirChatPage() {
  const [threads, setThreads] = useState<ChatThreadType[]>([mainThread, ...olderThreads]);
  const [activeThreadId, setActiveThreadId] = useState(mainThread.id);
  const [mode, setMode] = useState<ChatMode>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contextEntity, setContextEntity] = useState<EntityRef | null>(mainThread.contextEntity ?? null);

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const messages = activeThread?.messages ?? [];

  const handleSend = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const ceoMsg: FullChatMessage = {
      id: Date.now(), sender: 'ceo', time, contentType: 'text', content: text,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId ? { ...t, messages: [...t.messages, ceoMsg], preview: text } : t
      )
    );

    setIsTyping(true);

    const delay = 1200 + Math.random() * 1300;
    setTimeout(() => {
      const response = simulateResponse(text, mode);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId ? { ...t, messages: [...t.messages, response], preview: response.content || t.preview } : t
        )
      );
      setIsTyping(false);

      const entity = detectEntity(response);
      if (entity) setContextEntity(entity);
    }, delay);
  }, [activeThreadId, mode]);

  const handleNewThread = useCallback(() => {
    const newThread: ChatThreadType = {
      id: `thread-${Date.now()}`,
      title: 'New Conversation',
      preview: 'Start a new conversation with Tamir',
      timestamp: new Date(),
      messages: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setContextEntity(null);
  }, []);

  const handleSelectThread = useCallback((id: string) => {
    setActiveThreadId(id);
    const thread = threads.find((t) => t.id === id);
    setContextEntity(thread?.contextEntity ?? null);
  }, [threads]);

  return (
    <div className="flex h-full min-h-0">
      {/* Left sidebar */}
      <ChatSidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Center chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatThread
          messages={messages}
          isTyping={isTyping}
          onSuggestedPrompt={handleSend}
        />
        <ChatInput
          onSend={handleSend}
          mode={mode}
          onModeChange={setMode}
        />
      </div>

      {/* Right context panel */}
      <AnimatePresence>
        {contextEntity && (
          <ContextPanel
            entity={contextEntity}
            onClose={() => setContextEntity(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
