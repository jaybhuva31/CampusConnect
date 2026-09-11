import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ExternalLink, Code, FileText, Video } from 'lucide-react';
import axios from 'axios';

const StudyHub = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Engineering');

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/resources/?course_category=${encodeURIComponent(category)}`);
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
          <BookOpen className="text-primary" /> {t('studyHub.title')}
        </h1>
        <p className="text-secondary">{t('studyHub.subtitle')}</p>
      </div>

      {/* Category selector */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {['Engineering', 'IT & Computers', 'Commerce'].map(cat => (
          <button
            key={cat}
            className={`btn ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setCategory(cat)}
          >
            {cat} Resources
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="row g-4">
          {resources.map(r => (
            <div className="col-md-6" key={r.id}>
              <div className="card h-100 p-4 border-0 shadow-sm border-start border-4 border-primary">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-primary-subtle text-primary font-weight-bold">
                    {r.resource_type}
                  </span>
                  <small className="text-muted">{r.author_organization}</small>
                </div>

                <h5 className="font-weight-bold mb-1">{r.subject_name}</h5>
                <p className="text-secondary small mb-3">{r.title}</p>

                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <small className="text-muted">Open Educational Content</small>
                  <a href={r.url} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
                    Open Resource <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyHub;
