import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Copy,
  FileText,
  Loader2,
  Mail,
  Phone,
  RotateCcw,
  Send,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, InquiryConfirmation, ProjectBrief } from '../types';

interface AiIdeaMakerSectionProps {
  selectedTier: string;
  onTierChange: (tier: string) => void;
  presetIdeaText: string;
  onPresetConsumed: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: "Hi! I'm Mukund's Website Idea Maker powered by Gemini AI. Tell me what kind of business or project you have, and we'll plan the pages, style, and budget (between ₹1,000 and ₹20,000) so you can send it straight to Mukund at mukund.pm@outlook.com.",
};

const STARTER_PROMPTS = [
  'A local bakery or food storefront',
  'A coaching center or school website',
  'A personal portfolio under ₹3,500',
  'A local clinic with appointment booking',
];

const BUDGET_OPTIONS = [
  'Starter Site (₹1,000 – ₹3,500)',
  'Business & Storefront (₹4,500 – ₹10,000)',
  'Custom Web App & AI (₹12,000 – ₹20,000)',
];

export function AiIdeaMakerSection({
  selectedTier,
  onTierChange,
  presetIdeaText,
  onPresetConsumed,
}: AiIdeaMakerSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [generatedBrief, setGeneratedBrief] = useState<ProjectBrief | null>(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [ideaSummary, setIdeaSummary] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [confirmation, setConfirmation] = useState<InquiryConfirmation | null>(null);
  const [copied, setCopied] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isSendingChat]);

  useEffect(() => {
    if (presetIdeaText) {
      setIdeaSummary(presetIdeaText);
      onPresetConsumed();
    }
  }, [presetIdeaText, onPresetConsumed]);

  async function sendChatMessage(textToSend: string) {
    const trimmed = textToSend.trim();
    if (!trimmed || isSendingChat) return;

    setChatError(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsSendingChat(true);

    try {
      const historyPayload = nextHistory
        .filter((m) => m.id !== 'welcome')
        .slice(0, -1)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/idea-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyPayload,
          message: trimmed,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setChatError(errData.error || 'Could not reach Gemini AI right now.');
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setChatError('Streaming is unavailable right now. Please try again.');
        return;
      }

      const modelMsgId = `m-${Date.now()}`;
      setMessages((prev) => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const line = evt
            .split('\n')
            .find((l) => l.startsWith('data: '));
          if (!line) continue;

          try {
            const payload = JSON.parse(line.slice(6)) as {
              text?: string;
              error?: string;
              done?: boolean;
            };
            if (payload.error) {
              setChatError(payload.error);
              return;
            }
            if (payload.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === modelMsgId ? { ...m, text: m.text + payload.text } : m
                )
              );
            }
          } catch {
            // Ignore partial JSON chunk
          }
        }
      }
    } catch {
      setChatError('Network error while chatting with Gemini AI. Please try again.');
    } finally {
      setIsSendingChat(false);
    }
  }

  async function handleGenerateBrief() {
    const userTurns = messages.filter((m) => m.role === 'user');
    if (userTurns.length === 0 || isGeneratingBrief) return;

    setChatError(null);
    setIsGeneratingBrief(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/idea-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: historyPayload }),
      });

      const data = await res.json();
      if (!res.ok) {
        setChatError(data.error || 'Could not summarize your idea right now.');
        return;
      }

      const brief = data.brief as ProjectBrief;
      setGeneratedBrief(brief);

      if (brief.projectTitle && !businessName) {
        setBusinessName(brief.projectTitle);
      }

      if (brief.recommendedTier) {
        const matched = BUDGET_OPTIONS.find((opt) =>
          opt.toLowerCase().includes(brief.recommendedTier.split('(')[0].trim().toLowerCase())
        );
        if (matched) onTierChange(matched);
      }

      const compiledText = [
        brief.emailBriefSummary,
        brief.keyPages?.length ? `Pages: ${brief.keyPages.join(', ')}` : '',
        brief.features?.length ? `Features: ${brief.features.join(', ')}` : '',
        brief.designDirection ? `Style: ${brief.designDirection}` : '',
        brief.estimatedBudgetInr ? `Estimated Budget: ${brief.estimatedBudgetInr}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      setIdeaSummary(compiledText);
      setConfirmation(null);
    } catch {
      setChatError('Unable to summarize conversation. You can type your idea directly on the right.');
    } finally {
      setIsGeneratingBrief(false);
    }
  }

  function handleResetChat() {
    setMessages([INITIAL_MESSAGE]);
    setGeneratedBrief(null);
    setChatError(null);
  }

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!clientName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      setFormError('Please enter a valid email address so Mukund can reply.');
      return;
    }
    if (clientPhone.replace(/\D/g, '').length < 7) {
      setFormError('Please enter your phone number so Mukund can contact you for further details.');
      return;
    }
    if (ideaSummary.trim().length < 10) {
      setFormError('Please describe your website idea or generate a brief from the AI chat.');
      return;
    }

    setIsSubmittingForm(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          businessName: businessName.trim(),
          budgetTier: selectedTier,
          ideaSummary: ideaSummary.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Please check your contact details and try again.');
        return;
      }

      setConfirmation({
        referenceId: data.referenceId,
        recipientEmail: data.recipientEmail,
        mailtoUrl: data.mailtoUrl,
        formattedEmailText: data.formattedEmailText,
      });
    } catch {
      setFormError('Network error submitting your brief. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  }

  async function handleCopyBrief() {
    if (!confirmation) return;
    try {
      await navigator.clipboard.writeText(confirmation.formattedEmailText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <section id="idea-maker" className="border-b border-slate-200/80 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-slate-500">Gemini AI Studio</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              AI Website Idea Maker &amp; Direct Handoff
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Chat with Gemini AI to design your website concept, then share your phone number, email,
            and brief with Mukund at{' '}
            <span className="font-medium text-slate-900">mukund.pm@outlook.com</span>.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Gemini AI Idea Architect Chat */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#FAFAF8] shadow-[0_18px_40px_-24px_rgba(15,23,42,0.12)] lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <Bot className="h-5 w-5 text-[#1D4ED8]" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-950">
                    Website Idea Architect
                  </h3>
                  <p className="text-xs text-slate-500">Powered by Gemini AI</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasUserMessages && (
                  <button
                    type="button"
                    onClick={handleGenerateBrief}
                    disabled={isGeneratingBrief}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1E40AF] disabled:opacity-60 cursor-pointer whitespace-nowrap"
                  >
                    {isGeneratingBrief ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>{isGeneratingBrief ? 'Summarizing...' : 'Generate Project Brief'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Start new conversation"
                  aria-label="Reset AI chat"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Conversation History */}
            <div
              ref={chatScrollRef}
              className="flex h-[380px] flex-col gap-4 overflow-y-auto px-6 py-5"
            >
              {messages
                .filter((msg) => msg.text.length > 0)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="mb-1 px-1 text-[11px] font-medium text-slate-400">
                      {msg.role === 'user' ? 'You' : 'Idea Architect'}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#1D4ED8] text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-800 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.08)]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

              {isSendingChat &&
                !(
                  messages[messages.length - 1]?.role === 'model' &&
                  messages[messages.length - 1]?.text.length > 0
                ) && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                      <Loader2 className="h-4 w-4 animate-spin text-[#1D4ED8]" aria-hidden="true" />
                      <span>Thinking through your website plan...</span>
                    </div>
                  </div>
                )}

              {chatError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800"
                >
                  {chatError}
                </div>
              )}
            </div>

            {/* Starter Suggestions & Input Bar */}
            <div className="rounded-b-2xl border-t border-slate-200 bg-white p-4 sm:px-6">
              {!hasUserMessages && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendChatMessage(prompt)}
                      className="rounded-lg border border-slate-200 bg-[#FAFAF8] px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendChatMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <label htmlFor="ai-chat-input" className="sr-only">
                  Describe your website idea
                </label>
                <input
                  id="ai-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your shop, brand, or website idea..."
                  className="min-h-[44px] flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSendingChat || !input.trim()}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-45 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Ask AI</span>
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Contact Handoff Form to mukund.pm@outlook.com */}
          <div className="rounded-2xl border border-slate-200 bg-[#FAFAF8] p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.12)] sm:p-7 lg:col-span-5">
            {!confirmation ? (
              <form onSubmit={handleInquirySubmit} className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-slate-950">
                      Send Idea to Mukund
                    </h3>
                    <span className="font-mono text-xs text-slate-500">mukund.pm@outlook.com</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Share your email, phone number, and website idea. Mukund will contact you for
                    further details and start building.
                  </p>

                  {generatedBrief && (
                    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-slate-800">
                      <div className="font-semibold text-slate-950">
                        AI Brief Ready: {generatedBrief.projectTitle}
                      </div>
                      <div className="mt-1 text-slate-600">
                        {generatedBrief.businessType} · Est.{' '}
                        <span className="font-mono tabular-nums">
                          {generatedBrief.estimatedBudgetInr}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 space-y-4">
                    <div>
                      <label
                        htmlFor="client-name"
                        className="block text-xs font-medium text-slate-700"
                      >
                        Your Name
                      </label>
                      <input
                        id="client-name"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g., Aarav Sharma"
                        className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-950 focus:border-[#1D4ED8] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="client-phone"
                          className="block text-xs font-medium text-slate-700"
                        >
                          Phone Number
                        </label>
                        <input
                          id="client-phone"
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-950 focus:border-[#1D4ED8] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="client-email"
                          className="block text-xs font-medium text-slate-700"
                        >
                          Your Email Address
                        </label>
                        <input
                          id="client-email"
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-950 focus:border-[#1D4ED8] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="business-name"
                          className="block text-xs font-medium text-slate-700"
                        >
                          Business / Website Name
                        </label>
                        <input
                          id="business-name"
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g., Fresh Bakes Studio"
                          className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-950 focus:border-[#1D4ED8] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="budget-tier"
                          className="block text-xs font-medium text-slate-700"
                        >
                          Budget Range
                        </label>
                        <select
                          id="budget-tier"
                          value={selectedTier}
                          onChange={(e) => onTierChange(e.target.value)}
                          className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:border-[#1D4ED8] focus:outline-none"
                        >
                          {BUDGET_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="idea-summary"
                        className="block text-xs font-medium text-slate-700"
                      >
                        What You Want on Your Website
                      </label>
                      <textarea
                        id="idea-summary"
                        rows={4}
                        required
                        value={ideaSummary}
                        onChange={(e) => setIdeaSummary(e.target.value)}
                        placeholder="Chat with Gemini AI on the left and click 'Generate Project Brief', or type what pages and features you want here..."
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 focus:border-[#1D4ED8] focus:outline-none"
                      />
                    </div>
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800"
                    >
                      {formError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1E40AF] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmittingForm ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>
                    {isSubmittingForm
                      ? 'Preparing Your Brief...'
                      : 'Prepare & Send to mukund.pm@outlook.com'}
                  </span>
                </button>
              </form>
            ) : (
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-emerald-700">
                    <CheckCircle2 className="h-6 w-6 shrink-0" aria-hidden="true" />
                    <h3 className="font-display text-lg font-bold text-slate-950">
                      Project Brief Ready ({confirmation.referenceId})
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Your website brief, phone number (<span className="font-mono">{clientPhone}</span>
                    ), and reply email (<span className="font-medium">{clientEmail}</span>) are
                    formatted and ready for Mukund. Send it straight from your email app below so
                    Mukund can contact you for further details.
                  </p>

                  <pre className="mt-4 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {confirmation.formattedEmailText}
                  </pre>
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href={confirmation.mailtoUrl}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1E40AF]"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span>Open Email App to Send ({confirmation.recipientEmail})</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{copied ? 'Copied!' : 'Copy Brief Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmation(null)}
                      className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Edit Contact Info</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
