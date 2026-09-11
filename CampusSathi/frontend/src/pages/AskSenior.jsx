import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, CheckCircle2, UserCheck, Plus, Send } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AskSenior = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ask Question Modal / Form State
  const [showAskForm, setShowAskForm] = useState(false);
  const [qTitle, setQTitle] = useState('');
  const [qContent, setQContent] = useState('');
  const [qCollege, setQCollege] = useState('');

  // Answer Form State per question
  const [replyTextMap, setReplyTextMap] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('/api/questions/');
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to ask a question!');
      return;
    }
    try {
      await axios.post('/api/questions/', {
        user: user.id,
        title: qTitle,
        content: qContent,
        college_name: qCollege,
        status: 'Active'
      });
      setQTitle('');
      setQContent('');
      setQCollege('');
      setShowAskForm(false);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAnswer = async (qId) => {
    const text = replyTextMap[qId];
    if (!user) {
      alert('Please login to answer questions!');
      return;
    }
    if (!text || !text.trim()) return;

    try {
      await axios.post('/api/answers/', {
        question: qId,
        user: user.id,
        content: text.trim(),
        is_verified_senior_answer: user.role === 'senior' || user.is_senior_verified
      });
      setReplyTextMap(prev => ({ ...prev, [qId]: '' }));
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
            <MessageSquare className="text-primary" /> {t('askSenior.title')}
          </h1>
          <p className="text-secondary">{t('askSenior.subtitle')}</p>
        </div>

        <button className="btn btn-primary font-weight-bold d-flex align-items-center gap-1" onClick={() => setShowAskForm(!showAskForm)}>
          <Plus size={16} /> {t('askSenior.askQuestion')}
        </button>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <div className="card shadow-sm p-4 border-0 mb-4 bg-white border-start border-4 border-primary">
          <h5 className="font-weight-bold mb-3">Ask Gujarat Seniors a Question</h5>
          <form onSubmit={handlePostQuestion}>
            <div className="mb-3">
              <label className="form-label font-weight-semibold">Question Title</label>
              <input type="text" className="form-control" placeholder="e.g. How is LDCE computer engineering hostel mess and campus environment?" value={qTitle} onChange={e => setQTitle(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label font-weight-semibold">College / University Name (Optional)</label>
              <input type="text" className="form-control" placeholder="e.g. L.D. College of Engineering, Ahmedabad" value={qCollege} onChange={e => setQCollege(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label font-weight-semibold">Question Details</label>
              <textarea className="form-control" rows={3} placeholder="Describe your question in detail..." value={qContent} onChange={e => setQContent(e.target.value)} required />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-light" onClick={() => setShowAskForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Post Question</button>
            </div>
          </form>
        </div>
      )}

      {/* Questions Feed */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {questions.map(q => (
            <div className="card p-4 shadow-sm border-0 bg-white" key={q.id}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-secondary-subtle text-secondary small">
                  Asked by {q.user_name}
                </span>
                {q.college_name && (
                  <span className="badge bg-primary-subtle text-primary small">
                    📍 {q.college_name}
                  </span>
                )}
              </div>

              <h4 className="font-weight-bold text-dark mb-2">{q.title}</h4>
              <p className="text-secondary mb-3">{q.content}</p>

              {/* Answers Section */}
              <div className="bg-light p-3 rounded border mb-3">
                <h6 className="font-weight-bold mb-3">
                  Answers ({q.answers ? q.answers.length : 0})
                </h6>

                {q.answers && q.answers.map(ans => (
                  <div className="p-3 bg-white rounded border mb-2" key={ans.id}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <strong className="text-dark">{ans.user_name}</strong>
                      {ans.is_verified_senior_answer && (
                        <span className="badge bg-success text-white small d-inline-flex align-items-center gap-1">
                          <CheckCircle2 size={12} /> {t('askSenior.verifiedSeniorBadge')}
                        </span>
                      )}
                    </div>
                    <p className="small mb-0 text-secondary">{ans.content}</p>
                  </div>
                ))}

                {/* Reply box */}
                <div className="input-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a helpful answer..."
                    value={replyTextMap[q.id] || ''}
                    onChange={e => setReplyTextMap({ ...replyTextMap, [q.id]: e.target.value })}
                  />
                  <button className="btn btn-primary" onClick={() => handlePostAnswer(q.id)}>
                    <Send size={16} /> Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AskSenior;
