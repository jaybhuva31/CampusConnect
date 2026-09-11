import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search } from 'lucide-react';
import axios from 'axios';

const Faq = () => {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, [query]);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      let url = '/api/faqs/?';
      if (query) url += `query=${encodeURIComponent(query)}&`;
      const res = await axios.get(url);
      setFaqs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getQuestion = (f) => {
    if (i18n.language === 'gu' && f.question_gu) return f.question_gu;
    if (i18n.language === 'hi' && f.question_hi) return f.question_hi;
    return f.question_en;
  };

  const getAnswer = (f) => {
    if (i18n.language === 'gu' && f.answer_gu) return f.answer_gu;
    if (i18n.language === 'hi' && f.answer_hi) return f.answer_hi;
    return f.answer_en;
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
          <HelpCircle className="text-primary" /> Gujarat Student FAQ
        </h1>
        <p className="text-secondary">Frequently asked questions regarding admission, hostels, scholarships, and documents</p>
      </div>

      {/* SEARCH */}
      <div className="card shadow-sm p-3 mb-4 border-0">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search FAQ questions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Accordion List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="accordion shadow-sm border-0 rounded-3 overflow-hidden" id="faqAccordion">
          {faqs.map((f, idx) => (
            <div className="accordion-item border-bottom" key={f.id}>
              <h2 className="accordion-header" id={`heading${f.id}`}>
                <button
                  className={`accordion-button ${idx !== 0 ? 'collapsed' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${f.id}`}
                >
                  <strong className="text-dark me-2">Q:</strong> {getQuestion(f)}
                </button>
              </h2>
              <div
                id={`collapse${f.id}`}
                className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body bg-light text-secondary">
                  {getAnswer(f)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faq;
