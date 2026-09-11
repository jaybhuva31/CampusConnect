import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Globe, ExternalLink } from 'lucide-react';
import ReportModal from './ReportModal';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [showReport, setShowReport] = useState(false);

  const changeLanguage = (lng) => {
    localStorage.setItem('preferredLanguage', lng);
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top">
        <div className="container">
          <div className="row g-4">
            {/* Column 1: Brand & Tagline */}
            <div className="col-lg-4 col-md-6">
              <h5 className="font-weight-bold text-white mb-3 d-flex align-items-center gap-2">
                <span>🎓</span> Gujarat Student Saathi
              </h5>
              <p className="text-secondary small mb-3">
                “Gujarat na First-Year Students Mate All-in-One Guide” — Sourcing verified information from official government, university, and hostel portals across Gujarat.
              </p>
              <div className="alert alert-secondary text-dark p-2 small border-0 mb-3 d-flex align-items-start gap-2">
                <AlertCircle size={16} className="text-primary flex-shrink-0 mt-1" />
                <span>
                  <strong>Important Notice:</strong> Gujarat Student Saathi is an information platform. It is not a government department unless officially stated.
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-uppercase text-white font-weight-bold mb-3">Quick Navigation</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><Link to="/colleges" className="text-secondary text-decoration-none hover-white">🔎 Find Colleges</Link></li>
                <li className="mb-2"><Link to="/hostels" className="text-secondary text-decoration-none hover-white">🏠 Find Hostel & PG</Link></li>
                <li className="mb-2"><Link to="/admission" className="text-secondary text-decoration-none hover-white">📝 Admission Guide & GCAS</Link></li>
                <li className="mb-2"><Link to="/scholarships" className="text-secondary text-decoration-none hover-white">🎓 Scholarships & MYSY</Link></li>
                <li className="mb-2"><Link to="/courses" className="text-secondary text-decoration-none hover-white">📚 Course Finder</Link></li>
                <li className="mb-2"><Link to="/documents" className="text-secondary text-decoration-none hover-white">📄 Document Checklist</Link></li>
              </ul>
            </div>

            {/* Column 3: Portals & Verification */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-uppercase text-white font-weight-bold mb-3">Official Portals</h6>
              <ul className="list-unstyled mb-0 small">
                <li className="mb-2">
                  <a href="https://gcas.gujgov.edu.in" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none d-flex align-items-center gap-1">
                    GCAS Portal <ExternalLink size={12} />
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://gujacpc.admissions.nic.in" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none d-flex align-items-center gap-1">
                    ACPC Engineering Portal <ExternalLink size={12} />
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://mysy.guj.nic.in" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none d-flex align-items-center gap-1">
                    MYSY Scholarship Portal <ExternalLink size={12} />
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://www.digitalgujarat.gov.in" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none d-flex align-items-center gap-1">
                    Digital Gujarat Portal <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Language & Data Feedback */}
            <div className="col-lg-2 col-md-6">
              <h6 className="text-uppercase text-white font-weight-bold mb-3">Language</h6>
              <div className="d-flex flex-column gap-2 mb-3">
                <button
                  className={`btn btn-sm text-start ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </button>
                <button
                  className={`btn btn-sm text-start ${i18n.language === 'gu' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => changeLanguage('gu')}
                >
                  ગુજરાતી
                </button>
                <button
                  className={`btn btn-sm text-start ${i18n.language === 'hi' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => changeLanguage('hi')}
                >
                  हिंदी
                </button>
              </div>

              <button
                className="btn btn-outline-warning btn-sm w-100 mt-2"
                onClick={() => setShowReport(true)}
              >
                {t('verification.reportError')}
              </button>
            </div>
          </div>

          <hr className="border-secondary my-4" />

          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-secondary small">
            <div>
              &copy; {new Date().getFullYear()} Gujarat Student Saathi. All rights reserved.
            </div>
            <div className="d-flex gap-3 mt-2 mt-md-0">
              <Link to="/faq" className="text-secondary text-decoration-none">FAQ</Link>
              <span>•</span>
              <a href="#privacy" className="text-secondary text-decoration-none">Source Policy & Verification</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Error Reporting Modal */}
      <ReportModal show={showReport} onHide={() => setShowReport(false)} />
    </>
  );
};

export default Footer;
