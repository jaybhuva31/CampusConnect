import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, ExternalLink, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import ReportModal from '../components/ReportModal';

const ScholarshipFinder = () => {
  const { t } = useTranslation();
  const [scholarships, setScholarships] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReportScholarship, setSelectedReportScholarship] = useState(null);

  useEffect(() => {
    fetchScholarships();
  }, [query]);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      let url = '/api/scholarships/?';
      if (query) url += `query=${encodeURIComponent(query)}&`;
      const res = await axios.get(url);
      setScholarships(res.data);
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
          <Award className="text-warning" /> {t('scholarships.title')}
        </h1>
        <p className="text-secondary">{t('scholarships.subtitle')}</p>
      </div>

      {/* SEARCH */}
      <div className="card shadow-sm p-3 mb-4 border-0">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search scholarship name (MYSY, Digital Gujarat, CMSS)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* SCHOLARSHIP CARDS */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="row g-4">
          {scholarships.map(s => (
            <div className="col-lg-6" key={s.id}>
              <div className="card h-100 p-4 border-0 shadow-sm border-start border-4 border-success">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-success-subtle text-success font-weight-bold">
                    {s.category_eligibility}
                  </span>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Calendar size={14} /> Deadline: {s.application_deadline}
                  </small>
                </div>

                <h4 className="font-weight-bold mb-2">{s.title}</h4>
                <p className="small text-muted mb-3"><strong>Provider:</strong> {s.provider}</p>

                <div className="p-3 rounded mb-3 border">
                  <h6 className="font-weight-bold text-success m-0 mb-1 d-flex align-items-center gap-1">
                    <DollarSign size={16} /> Financial Benefits
                  </h6>
                  <p className="small mb-0 text-secondary">{s.financial_benefits}</p>
                </div>

                <div className="small text-secondary mb-3">
                  <strong>Eligibility:</strong> {s.eligibility_criteria}
                </div>

                <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between gap-2">
                  <button
                    className="btn btn-outline-warning text-dark btn-sm d-flex align-items-center gap-1"
                    onClick={() => setSelectedReportScholarship(s)}
                  >
                    <AlertTriangle size={14} /> Report Error
                  </button>
                  <a href={s.official_url} target="_blank" rel="noreferrer" className="btn btn-success btn-sm d-flex align-items-center gap-1">
                    Official Portal <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReportScholarship && (
        <ReportModal
          show={!!selectedReportScholarship}
          onHide={() => setSelectedReportScholarship(null)}
          itemName={selectedReportScholarship.title}
          itemType="Scholarship"
          itemId={selectedReportScholarship.id}
        />
      )}
    </div>
  );
};

export default ScholarshipFinder;
