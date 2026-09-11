import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCheck, CheckCircle2, Circle, Printer, AlertCircle } from 'lucide-react';
import axios from 'axios';

const DocumentChecklist = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local state for tracking completion
  const [readyMap, setReadyMap] = useState({});

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/api/documents/');
      setDocuments(res.data);
      // Initialize ready map
      const initialMap = {};
      res.data.forEach(d => {
        initialMap[d.id] = false;
      });
      setReadyMap(initialMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReady = (id) => {
    setReadyMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalCount = documents.length;
  const readyCount = Object.values(readyMap).filter(Boolean).length;
  const progressPct = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
            <FileCheck className="text-primary" /> First-Year Document Checklist
          </h1>
          <p className="text-secondary mb-0">Interactive document readiness tracker for Gujarat college admissions & scholarships</p>
        </div>

        <button className="btn btn-outline-secondary d-flex align-items-center gap-1" onClick={() => window.print()}>
          <Printer size={16} /> Print Checklist PDF
        </button>
      </div>

      {/* Progress Bar Header */}
      <div className="card shadow-sm p-4 border-0 mb-4 bg-white border-start border-4 border-primary">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="font-weight-bold m-0">Documents Ready Status</h5>
          <span className="badge bg-primary text-white font-weight-bold fs-6">
            Documents Ready: {readyCount} / {totalCount} ({progressPct}%)
          </span>
        </div>
        <div className="progress" style={{ height: '12px' }}>
          <div className="progress-bar bg-primary" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="alert alert-info d-flex align-items-center gap-2 mb-4">
        <AlertCircle size={20} className="flex-shrink-0" />
        <small>
          <strong>Security Policy:</strong> This checklist tracks document readiness in your browser. Sensitive documents are not uploaded or stored permanently.
        </small>
      </div>

      {/* Document List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="row g-3">
          {documents.map(doc => {
            const isReady = readyMap[doc.id];
            return (
              <div className="col-md-6" key={doc.id}>
                <div
                  onClick={() => toggleReady(doc.id)}
                  className={`card p-3 border-0 rounded-3 shadow-sm d-flex flex-row align-items-center justify-content-between ${
                    isReady ? 'bg-light text-muted' : 'bg-white border'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    {isReady ? (
                      <CheckCircle2 size={24} className="text-success flex-shrink-0" />
                    ) : (
                      <Circle size={24} className="text-secondary flex-shrink-0" />
                    )}
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`font-weight-bold ${isReady ? 'text-decoration-line-through' : 'text-dark'}`}>{doc.title}</span>
                        {doc.is_mandatory && <span className="badge bg-danger-subtle text-danger small">Mandatory</span>}
                      </div>
                      <small className="text-secondary d-block">{doc.description}</small>
                    </div>
                  </div>

                  <span className={`badge ${isReady ? 'bg-success' : 'bg-secondary'}`}>
                    {isReady ? '✓ Ready' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentChecklist;
