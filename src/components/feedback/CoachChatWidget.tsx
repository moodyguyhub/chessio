'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { slideUp, gentleNudge } from '@/lib/motion';

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
}

export function CoachChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Gentle nudge after 30 seconds on page (once)
  useEffect(() => {
    if (!isOpen && !shouldReduceMotion) {
      const timer = setTimeout(() => {
        setShowNudge(true);
        // Reset after animation completes
        setTimeout(() => setShowNudge(false), 600);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldReduceMotion]);

  // Send greeting message when chat first opens
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      const greetingMessage: Message = {
        id: `coach-greeting-${Date.now()}`,
        role: 'coach',
        content: 'I am your Coach. Ask me about a position, or tell me what felt unclear in this level.',
      };
      setMessages([greetingMessage]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, messages.length]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsThinking(true);

    try {
      // Get context from current URL
      const context = {
        path: window.location.pathname,
        // Could parse level/lessonSlug from path if needed
      };

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get coach response');
      }

      const data = await response.json();
      const coachMessage: Message = {
        id: `coach-${Date.now()}`,
        role: 'coach',
        content: data.reply || 'No response from coach.',
      };

      setMessages((prev) => [...prev, coachMessage]);
    } catch (err) {
      console.error('Coach chat error:', err);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        // Floating button with gentle nudge animation
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          aria-label="Ask the Coach"
          variants={shouldReduceMotion ? undefined : gentleNudge}
          initial="initial"
          animate={showNudge ? "nudge" : "initial"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask the Coach
          </div>
        </motion.button>
      ) : (
        // Chat panel with slide-up animation
        <motion.div
          variants={shouldReduceMotion ? undefined : slideUp}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Card className="w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold">The Coach</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-8">
                <p className="mb-2">Ask me about chess ideas.</p>
                <p className="text-xs italic">
                  &ldquo;I teach understanding, not just moves.&rdquo;
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-sm italic">
                  Coach is thinking...
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="text-sm">
                {error}
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <textarea
                className="flex-1 px-3 py-2 rounded-md border border-slate-600 bg-slate-900/50 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none disabled:opacity-50"
                placeholder="Ask me about your position – or tell me what felt confusing so far."
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isThinking}
                maxLength={2000}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                size="sm"
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>
        </motion.div>
      )}
    </div>
  );
}
