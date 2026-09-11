import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AiChatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: i18n.language === 'gu' 
        ? 'નમસ્તે! હું "ગુજરાત સ્ટુડન્ટ સાથી AI" છું. ગુજરાતની કોલેજો, હોસ્ટેલ, એડમિશન અને સ્કોલરશિપ વિશે પૂછો.'
        : (i18n.language === 'hi' 
            ? 'नमस्ते! मैं "गुजरात स्टूडेंट साथी AI" हूँ। गुजरात के कॉलेज, हॉस्टल, एडमिशन और स्कॉलरशिप के बारे में पूछें।'
            : 'Hello! I am "Gujarat Student Saathi AI". Ask me about verified colleges, hostels, admission guides, or scholarships in Gujarat.')
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat/', {
        message: userMsg,
        language: i18n.language || 'en'
      });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Something went wrong. Please check your network connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="btn btn-primary ai-fab d-flex align-items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ask Gujarat Student Saathi AI"
      >
        <Bot size={20} />
        <span>{t('ai.title')}</span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="card shadow-lg border-0"
          style={{
            position: 'fixed',
            bottom: '85px',
            right: '25px',
            width: '380px',
            maxWidth: '90vw',
            height: '520px',
            zIndex: 1060,
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center gap-2">
              <Bot size={24} />
              <div>
                <h6 className="m-0 font-weight-bold">{t('ai.title')}</h6>
                <small style={{ fontSize: '11px', opacity: 0.9 }}>Verified DB Intelligence</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>

          {/* Message List */}
          <div className="card-body p-3 overflow-auto flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`d-flex mb-3 ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-3 rounded-3 shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white text-dark border'
                  }`}
                  style={{ maxWidth: '85%', fontSize: '14px', whiteSpace: 'pre-line' }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="d-flex align-items-center gap-2 text-muted small p-2">
                <Sparkles className="spin" size={16} /> Querying verified database...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Disclaimer & Input Form */}
          <div className="card-footer bg-white p-2 border-top">
            <div className="text-muted small px-2 py-1 mb-1 d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
              <AlertCircle size={12} /> {t('ai.disclaimer')}
            </div>
            <form onSubmit={handleSend} className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder={t('ai.placeholder')}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatbot;
