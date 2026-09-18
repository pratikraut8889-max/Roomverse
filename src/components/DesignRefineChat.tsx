import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, User, RefreshCw, ShoppingBag, Palette, Compass } from 'lucide-react';
import { DesignRevisionMessage, ShoppableProduct } from '../types';
import { ShoppableProducts } from './ShoppableProducts';

interface DesignRefineChatProps {
  messages: DesignRevisionMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  activeStyleName: string;
  onAddToProject?: (product: ShoppableProduct) => void;
}

const QUICK_PROMPTS = [
  'Keep this layout but make the rug navy blue',
  'Swap the coffee table for fluted walnut',
  'Add warm 2700K brass articulated sconces',
  'Introduce a large fiddle leaf fig in ceramic planter',
  'Lighten the wall paint to warm alabaster linen',
];

export const DesignRefineChat: React.FC<DesignRefineChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeStyleName,
  onAddToProject,
}) => {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div
      id="design-refine-chat-section"
      className="mt-8 rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-base text-white flex items-center gap-2">
              Context-Aware Design Refinement & Sourcing
              <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 border border-white/10">
                {activeStyleName} Focus
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Iterate on materials, colorways, and spatial layout in natural language. Sourced items update in real time.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Senior AI Design Consultant
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-3 bg-stone-50 border-b border-stone-200/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Quick Refine:
        </span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleQuickPrompt(prompt)}
            disabled={isLoading}
            className="px-3 py-1 text-xs font-medium text-stone-700 bg-white hover:bg-amber-50 hover:text-amber-900 border border-stone-200 hover:border-amber-300 rounded-full transition-all shrink-0 shadow-2xs disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Thread */}
      <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto bg-stone-50/40">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              id={`chat-msg-${msg.id}`}
              className={`flex gap-3.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                  RR
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4.5 ${
                  isAssistant
                    ? 'bg-white border border-stone-200 text-stone-800 shadow-sm'
                    : 'bg-stone-900 text-stone-100 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] opacity-70">
                  <span className="font-semibold">
                    {isAssistant ? 'RoomRevise Design Consultant' : 'You (Designer)'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Suggested changes bullet list if present */}
                {msg.suggestedChanges && msg.suggestedChanges.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1 mb-1.5">
                      <Compass className="w-3.5 h-3.5" /> Architectural Specifications Adjusted:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600 list-disc list-inside">
                      {msg.suggestedChanges.map((change, idx) => (
                        <li key={idx} className="leading-snug">{change}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Updated Style Summary badges */}
                {msg.updatedStyleSummary && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    {msg.updatedStyleSummary.colorUpdate && (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200/60 font-medium flex items-center gap-1">
                        <Palette className="w-3 h-3 text-amber-700" /> {msg.updatedStyleSummary.colorUpdate}
                      </span>
                    )}
                  </div>
                )}

                {/* Embedded shoppable products for this refinement turn */}
                {msg.shoppableProducts && msg.shoppableProducts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <ShoppableProducts
                      products={msg.shoppableProducts}
                      onAddToProject={onAddToProject}
                    />
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold animate-pulse">
              RR
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
              <div className="text-xs text-stone-600 font-medium">
                Generating architectural revisions and matching shoppable inventory...
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-stone-200 flex items-center gap-3"
      >
        <div className="relative flex-1">
          <input
            id="input-design-refine"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 'Keep this layout but make the rug blue and switch to matte black sconces'..."
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50 placeholder:text-stone-400 transition-all disabled:opacity-50"
          />
        </div>

        <button
          id="btn-send-refinement"
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Refine</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
