import { useEffect, useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DashboardCopilotProps {
  seededPrompt: string;
}

const mockReply = (prompt: string) => {
  const text = prompt.trim();
  if (!text) {
    return 'Share a market question, and I will answer using the current dashboard context.';
  }
  return `Based on the selected metric, start with risk controls first, then validate trend and momentum before taking a position. Suggested next step: compare price action with broader index movement and only act if both align.`;
};

export function DashboardCopilot({ seededPrompt }: DashboardCopilotProps) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const nextPrompt = seededPrompt.trim();
    if (nextPrompt) {
      setDraft(nextPrompt);
    }
  }, [seededPrompt]);

  const submit = () => {
    const content = draft.trim() || seededPrompt.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now() + 1}`,
      role: 'assistant',
      content: mockReply(content),
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraft('');
  };

  return (
    <div className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-50 shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight text-slate-100">
          <Sparkles className="h-5 w-5 text-blue-400" />
          Dashboard Copilot
        </h3>
      </div>
      <div className="space-y-4 p-6 pt-0">
        <div className="h-56 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                message.role === 'assistant'
                  ? 'bg-slate-900 text-slate-200 border border-slate-800'
                  : 'bg-blue-500/15 text-blue-100 border border-blue-500/30'
              }`}
            >
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
                {message.role === 'assistant' ? <MessageSquare className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                {message.role}
              </div>
              {message.content}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="输入你的问题，或点击上方指标自动生成问题"
              className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-2"
            />
            <button
              type="button"
              onClick={submit}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
