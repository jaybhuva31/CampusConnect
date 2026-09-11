import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Building2, Home as HomeIcon, Award, FileText, BookOpen, Users, CheckCircle2, ChevronRight, Bell, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [colRes, hosRes, notRes] = await Promise.all([
        axios.get('/api/colleges/'),
        axios.get('/api/hostels/'),
        axios.get('/api/notices/?active_only=true')
      ]);
      setColleges(colRes.data.slice(0, 4));
      setHostels(hosRes.data.slice(0, 4));
      setNotices(notRes.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-banner">
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill font-weight-semibold mb-3 d-inline-block">
                🎓 Gujarat's #1 Student Guide 2026
              </span>
              <h1 className="display-4 font-weight-extrabold mb-2">
                {t('hero.heading')}
              </h1>
              <h2 className="h2 text-primary font-weight-bold mb-3">
                {t('hero.headingSub')}
              </h2>
              <p className="lead text-secondary mb-4">
                {t('hero.subheading')}
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <Link to="/colleges" className="btn btn-primary btn-lg shadow-sm">
                  {t('hero.btnFindCollege')}
                </Link>
                <Link to="/hostels" className="btn btn-success btn-lg shadow-sm">
                  {t('hero.btnFindHostel')}
                </Link>
                <Link to="/courses" className="btn btn-outline-secondary btn-lg">
                  {t('hero.btnExploreCourses')}
                </Link>
                <Link to="/onboarding" className="btn btn-warning text-dark font-weight-bold btn-lg">
                  ✨ {t('hero.btnFirstYear')}
                </Link>
              </div>

              {/* Trust Tag */}
              <div className="d-flex align-items-center gap-3 text-muted small">
                <span className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" /> Reliable Sources
                </span>
                <span>•</span>
                <span className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={16} className="text-primary" /> English + ગુજરાતી + हिंदी
                </span>
              </div>
            </div>

            {/* Visual Graphic Card */}
            <div className="col-lg-5 text-center">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden p-4">
                <div className="text-start mb-3">
                  <span className="badge bg-success mb-2">Gujarat Higher Education</span>
                  <h5 className="font-weight-bold m-0">Ahmedabad, Surat, Rajkot, Vadodara</h5>
                  <small className="text-muted">Comprehensive Higher Education Coverage</small>
                </div>
                
                <div className="p-3 rounded-3 text-start mb-3 border">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="font-weight-bold">🎯 First-Year Milestones</span>
                    <span className="badge bg-primary">Active</span>
                  </div>
                  <div className="small text-secondary">
                    ✓ College Selection & GCAS Registration<br />
                    ✓ MYSY & Digital Gujarat Scholarships<br />
                    ✓ Government & Nearby Hostel Discovery
                  </div>
                </div>

                <div className="row g-2 text-center">
                  <div className="col-6">
                    <div className="p-2 border rounded">
                      <h4 className="m-0 font-weight-bold text-primary">33</h4>
                      <small className="text-muted">Districts Covered</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 border rounded">
                      <h4 className="m-0 font-weight-bold text-success">100%</h4>
                      <small className="text-muted">Verified Sources</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK GLOBAL SEARCH BAR */}
      <section className="py-4 bg-primary text-white">
        <div className="container">
          <form onSubmit={handleGlobalSearch} className="row g-2 align-items-center justify-content-center">
            <div className="col-md-8 col-lg-7">
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text border-0 text-muted">
                  <Search size={22} />
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="🔎 Search Colleges (LDCE, SVNIT, MSU, SCET), Hostels, Courses, City..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-warning text-dark font-weight-bold px-4">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ONBOARDING WIZARD PROMO BANNER */}
      <section className="py-5 border-bottom">
        <div className="container">
          <div className="card text-white border-0 p-4 p-md-5 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)' }}>
            <div className="row align-items-center">
              <div className="col-lg-8 mb-3 mb-lg-0">
                <span className="badge bg-warning text-dark mb-2">Help Me Get Started</span>
                <h3 className="font-weight-bold text-white mb-2">New First-Year College Student in Gujarat?</h3>
                <p className="mb-0 text-white-50">
                  Generate your personalized <strong>First-Year Checklist</strong> covering Admission, Documents, Hostels, Transport, and Study Resources in 60 seconds.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/onboarding" className="btn btn-light btn-lg text-primary font-weight-bold shadow">
                  Start Onboarding Wizard <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLEGES SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="font-weight-bold m-0 d-flex align-items-center gap-2">
                <Building2 className="text-primary" /> Colleges in Gujarat
              </h2>
              <small className="text-muted">Top government, grant-in-aid, and recognized institutions in Ahmedabad, Surat, Rajkot, Vadodara</small>
            </div>
            <Link to="/colleges" className="btn btn-outline-primary btn-sm">
              View All Colleges ({colleges.length}+) <ChevronRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {colleges.map(col => (
              <div className="col-md-6 col-lg-3" key={col.id}>
                <div className="card h-100 p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className={`badge ${col.college_type === 'Government' ? 'bg-success' : 'bg-primary'}`}>
                      {col.college_type}
                    </span>
                    <small className="text-muted d-flex align-items-center gap-1">
                      <MapPin size={12} /> {col.city}
                    </small>
                  </div>
                  <h5 className="font-weight-bold mb-1">{col.name}</h5>
                  <p className="small text-muted mb-2">{col.university_name || 'State University'}</p>
                  
                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <Link to={`/college/${col.id}`} className="btn btn-sm btn-outline-primary w-100">
                      View Details & Nearby Hostels
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOSTELS SECTION */}
      <section className="py-5 border-top border-bottom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="font-weight-bold m-0 d-flex align-items-center gap-2">
                <HomeIcon className="text-success" /> Hostels & PG Accommodations
              </h2>
              <small className="text-muted">Government Samarsata hostels, university hostels & student PGs</small>
            </div>
            <Link to="/hostels" className="btn btn-outline-success btn-sm">
              Explore Hostel Finder <ChevronRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {hostels.map(h => (
              <div className="col-md-6 col-lg-3" key={h.id}>
                <div className="card h-100 p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className={`badge ${h.gender === 'Girls' ? 'bg-danger' : 'bg-primary'}`}>
                      {h.gender}
                    </span>
                    <span className="badge bg-secondary-subtle text-secondary border">
                      {h.hostel_type}
                    </span>
                  </div>
                  <h6 className="font-weight-bold mb-1">{h.name}</h6>
                  <p className="small text-muted mb-2">📍 {h.area || h.city}, {h.district}</p>

                  <div className="p-2 rounded small mb-2 border">
                    <strong>Annual Fee:</strong> <span className="text-success font-weight-bold">{h.annual_fee_approx}</span>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link to={`/hostels`} className="btn btn-sm btn-outline-success w-100">
                      View Contact & Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NOTICES TICKER */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="font-weight-bold m-0 d-flex align-items-center gap-2">
              <Bell className="text-warning" /> Latest Admission & Scholarship Notices
            </h3>
            <Link to="/notices" className="btn btn-outline-secondary btn-sm">View All Notices</Link>
          </div>

          <div className="row g-3">
            {notices.map(n => (
              <div className="col-md-4" key={n.id}>
                <div className="card p-3 h-100 border-start border-4 border-warning">
                  <span className="badge bg-warning text-dark align-self-start mb-2">{n.category}</span>
                  <h6 className="font-weight-bold mb-2">{n.title}</h6>
                  <p className="small text-secondary mb-3">{n.summary}</p>
                  <div className="mt-auto d-flex align-items-center justify-content-between small text-muted border-top pt-2">
                    <span>Published: {n.publish_date}</span>
                    <a href={n.source_url} target="_blank" rel="noreferrer" className="text-primary font-weight-bold">
                      Source Portal &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
