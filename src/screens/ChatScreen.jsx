import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, AlertTriangle } from 'lucide-react';
import { getChatResponse, detectCrisisLocal } from '../services/claudeService';
import CrisisModal from '../components/CrisisModal';

const BRIDGE_INTRO = {
  English: "Hey 👋 I'm here, and I'm listening. What's on your mind today?",
  Hindi: "नमस्ते 👋 मैं यहाँ हूँ, और सुन रहा हूँ। आज आपके मन में क्या है?",
};

export default function ChatScreen({ onBack, t, lang, userName }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: BRIDGE_INTRO[lang] || BRIDGE_INTRO.English }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [showCounselorOffer, setShowCounselorOffer] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (detectCrisisLocal(text)) { setShowCrisis(true); return; }

    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    try {
      const apiMessages = newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const reply = await getChatResponse(apiMessages, lang, userName);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (newTurn >= 10 && !showCounselorOffer) setShowCounselorOffer(true);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm so sorry — I had a little hiccup. But I'm here. Could you tell me what you were sharing? 💜",
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <div className="flex flex-col bg-surface-900 h-dvh lg:h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 lg:px-8 py-4 bg-surface-800 border-b border-white/5 flex-shrink-0">
          <button onClick={onBack} className="lg:hidden p-2 -ml-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="text-base">🤝</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm lg:text-base">Bridge</p>
              <p className="text-accent-400 text-xs">Always here · Never judges · Totally private</p>
            </div>
          </div>
          <button
            onClick={() => setShowCrisis(true)}
            className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-500/25 transition-colors"
          >
            <AlertTriangle size={12} />
            Help
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-5 space-y-4">
          <div className="max-w-2xl mx-auto w-full space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex gap-3 items-end">
                <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">🤝</span>
                </div>
                <div className="glass px-4 py-3.5 flex items-center gap-2">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            {showCounselorOffer && !loading && (
              <div className="glass border-primary-500/30 p-4 text-center animate-slide-up">
                <p className="text-white/70 text-sm mb-3">{t('chat_offer')}</p>
                <a href="https://icallhelpline.org" target="_blank" rel="noopener noreferrer" className="btn-accent text-sm inline-block">
                  {t('chat_offer_cta')}
                </a>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-4 lg:px-8 py-4 bg-surface-800 border-t border-white/5 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex gap-3 items-end">
            <textarea
              ref={inputRef}
              className="input-field flex-1 resize-none text-sm leading-relaxed max-h-32"
              rows={1}
              placeholder={t('chat_placeholder')}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                input.trim() && !loading ? 'bg-primary-500 shadow-glow hover:bg-primary-600 active:scale-90' : 'bg-surface-700 cursor-not-allowed'
              }`}
            >
              {loading
                ? <Loader2 size={18} className="animate-spin text-white/40" />
                : <Send size={18} className={input.trim() ? 'text-white' : 'text-white/30'} />
              }
            </button>
          </div>
          <p className="text-white/15 text-xs text-center mt-2">
            🔒 Conversations are private and stay on your device
          </p>
        </div>
      </div>
      {showCrisis && <CrisisModal onClose={() => setShowCrisis(false)} t={t} />}
    </>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] lg:max-w-[65%] bg-primary-600/90 text-white px-4 py-3 rounded-3xl rounded-br-lg text-sm leading-relaxed shadow-md">
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow">
        <span className="text-xs">🤝</span>
      </div>
      <div className="max-w-[78%] lg:max-w-[65%] glass px-4 py-3.5 text-sm leading-relaxed text-white/90">
        {msg.content}
      </div>
    </div>
  );
}
