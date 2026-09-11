import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, ExternalLink, Calendar } from 'lucide-react';
import axios from 'axios';
import VerificationBadge from '../components/VerificationBadge';

const Notices = () => {
  const { t } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [activeOnly, setActiveOnly] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, [activeOnly]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/notices/?active_only=${activeOnly}`);
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
            <Bell className="text-warning" /> Official Gujarat Student Notices
          </h1>
          <p className="text-secondary mb-0">Admission deadlines, scholarship announcements & university notifications</p>
        </div>

        <div className="btn-group">
          <button
            className={`btn ${activeOnly ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveOnly(true)}
          >
            Current Active Notices
          </button>
          <button
            className={`btn ${!activeOnly ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveOnly(false)}
          >
            All / Expired History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="row g-4">
          {notices.map(n => (
            <div className="col-md-6" key={n.id}>
              <div className="card h-100 p-4 border-0 shadow-sm border-start border-4 border-warning">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-warning text-dark font-weight-bold">{n.category}</span>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Calendar size={14} /> Published: {n.publish_date}
                  </small>
                </div>

                <h4 className="font-weight-bold text-dark mb-2">{n.title}</h4>
                <p className="text-secondary small mb-3">{n.summary}</p>

                {n.expiry_date && (
                  <div className="small text-muted mb-2">
                    Expiry Date: <strong>{n.expiry_date}</strong>
                  </div>
                )}

                <VerificationBadge
                  status={n.verification_status}
                  lastVerified={n.last_verified_date}
                  sourceName={n.source_name}
                />

                <div className="mt-auto pt-3 border-top d-flex justify-content-end">
                  {n.source_url && (
                    <a href={n.source_url} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
                      Official Source Link <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;
