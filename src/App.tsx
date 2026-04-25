import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, History, Cpu, FileText, Globe, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import { runAgent } from './agent/engine';
import { AgentResponse, AgentStep } from './agent/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; trace?: AgentStep[] }[]>([]);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = query;
    setQuery('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const result = await runAgent(userMsg);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.answer, 
        trace: result.trace 
      }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-[#ececec] font-sans">
      {/* Sidebar - Optional for later features */}
      <div className="hidden md:flex w-64 bg-[#000000] border-r border-[#262626] flex-col p-4">
        <h1 className="text-xl font-bold mb-8">IPL Agent</h1>
        <button 
          onClick={() => setMessages([])} 
          className="w-full py-2 px-4 border border-[#262626] rounded-md hover:bg-[#2f2f2f] transition text-left text-sm"
        >
          + New Chat
        </button>
      </div>

      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 pb-32">
          <div className="chat-container px-4">
            {messages.length === 0 && !loading && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <Cpu className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                <p className="text-sm text-gray-500 max-w-sm">Ask anything about IPL 2024 tournament, stats, or latest news.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col mb-8 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={msg.role === 'user' ? 'message-user' : 'message-assistant'}>
                  <div className="flex items-start gap-4">
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center shrink-0">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="markdown-body prose prose-invert max-w-none prose-sm">
                        {msg.content}
                      </div>

                      {/* Expandable Trace for Assistant Messages */}
                      {msg.trace && msg.trace.length > 0 && (
                        <details className="mt-4 border-t border-white/5 pt-2">
                          <summary className="text-[10px] text-gray-500 uppercase font-bold cursor-pointer hover:text-gray-300">
                             View Reasoning Trace ({msg.trace.length} steps)
                          </summary>
                          <div className="mt-2 space-y-2 pl-4 border-l border-white/10">
                            {msg.trace.map((step, idx) => (
                              <div key={idx} className="text-[11px] text-gray-500">
                                <span className="text-cyan-600 font-mono">STEP {idx+1}: </span>
                                <span className="italic">"{step.thought}"</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-4 message-assistant">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
                <div className="flex gap-1 items-center mt-3">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400 text-sm my-4">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div ref={scrollEndRef} />
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent pt-10 pb-8">
          <div className="chat-container px-4">
            <form onSubmit={handleSearch} className="input-container flex items-center p-2 focus-within:ring-1 focus-within:ring-[#262626]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Message IPL Agent..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm outline-none"
              />
              <button 
                type="submit"
                disabled={loading || !query.trim()}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-500 text-center mt-2">
              IPL Agent can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

