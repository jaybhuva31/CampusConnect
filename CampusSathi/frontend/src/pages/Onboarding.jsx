import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Sparkles, ArrowRight, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Onboarding = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    district: 'Ahmedabad',
    course: 'B.E. / B.Tech Computer Engineering',
    collegeType: 'Government',
    gender: 'Boys',
    hostelNeeded: 'Yes',
    budget: 'Under Rs. 30,000 / Year',
    preferredLang: 'en'
  });

  // Generated Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, title: 'Choose Target College in Gujarat', category: 'Admission', completed: true },
    { id: 2, title: 'Check Eligibility & GCAS / ACPC Portal Deadlines', category: 'Admission', completed: true },
    { id: 3, title: 'Prepare 10th/12th Marksheets & Leaving Certificate', category: 'Documents', completed: false },
    { id: 4, title: 'Obtain Mamlatdar Income Certificate for MYSY', category: 'Scholarships', completed: false },
    { id: 5, title: 'Apply on MYSY / Digital Gujarat Scholarship Portal', category: 'Scholarships', completed: false },
    { id: 6, title: 'Apply for Government Samarsata / Trust Hostel', category: 'Hostel', completed: false },
    { id: 7, title: 'Get GSRTC / AMTS Concession Student Bus Pass', category: 'Transport', completed: false },
    { id: 8, title: 'Download GTU / University First-Year Study Notes', category: 'Study', completed: false },
  ]);

  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const res = await axios.get('/api/districts/');
      setDistricts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const completedCount = checklist.filter(i => i.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  const handleFinishWizard = () => {
    if (formData.preferredLang !== i18n.language) {
      localStorage.setItem('preferredLanguage', formData.preferredLang);
      i18n.changeLanguage(formData.preferredLang);
    }
    setStep(3); // Show Checklist Dashboard
  };

  return (
    <div className="container py-5">
      <div className="text-center max-w-3xl mx-auto mb-4">
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill font-weight-bold mb-2">
          ✨ {t('onboarding.title')}
        </span>
        <h1 className="font-weight-extrabold">{t('onboarding.title')}</h1>
        <p className="text-secondary">{t('onboarding.subtitle')}</p>
      </div>

      {step === 1 && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm p-4 border-0">
              <h5 className="font-weight-bold mb-3 border-bottom pb-2">Step 1 of 2: Your Academic & Location Preference</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">{t('onboarding.district')}</label>
                  <select className="form-select" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })}>
                    {districts.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.name_gu || d.name})</option>
                    ))}
                    {districts.length === 0 && <option value="Ahmedabad">Ahmedabad</option>}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">{t('onboarding.course')}</label>
                  <select className="form-select" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })}>
                    <option value="B.E. / B.Tech Computer Engineering">B.E. / B.Tech Computer Engineering</option>
                    <option value="B.E. / B.Tech Information Technology">B.E. / B.Tech Information Technology</option>
                    <option value="B.C.A. (Bachelor of Computer Applications)">B.C.A. (Computer Applications)</option>
                    <option value="B.B.A. (Bachelor of Business Administration)">B.B.A. (Business Administration)</option>
                    <option value="B.Com (Bachelor of Commerce)">B.Com (Bachelor of Commerce)</option>
                    <option value="B.Sc. Computer Science / Chemistry">B.Sc. Science / Computer Science</option>
                    <option value="B.Pharm (Bachelor of Pharmacy)">B.Pharm (Pharmacy)</option>
                    <option value="Diploma Engineering">Diploma Engineering</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">{t('onboarding.collegeType')}</label>
                  <select className="form-select" value={formData.collegeType} onChange={e => setFormData({ ...formData, collegeType: e.target.value })}>
                    <option value="Government">Government College</option>
                    <option value="Grant-in-Aid">Grant-in-Aid College</option>
                    <option value="Private">Private / Self-Finance</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">{t('onboarding.gender')}</label>
                  <select className="form-select" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary px-4 d-flex align-items-center gap-2" onClick={() => setStep(2)}>
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm p-4 border-0">
              <h5 className="font-weight-bold mb-3 border-bottom pb-2">Step 2 of 2: Hostel & Language Preference</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">{t('onboarding.hostelNeeded')}</label>
                  <select className="form-select" value={formData.hostelNeeded} onChange={e => setFormData({ ...formData, hostelNeeded: e.target.value })}>
                    <option value="Yes">Yes, Hostel / PG Required</option>
                    <option value="No">No, Local Resident</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">{t('onboarding.budget')}</label>
                  <select className="form-select" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })}>
                    <option value="Government Subsidized (Under Rs. 10,000 / Year)">Government Subsidized (Under Rs. 10,000 / Year)</option>
                    <option value="Trust / Subsidized (Rs. 10,000 - Rs. 35,000 / Year)">Trust Hostel (Rs. 10,000 - Rs. 35,000 / Year)</option>
                    <option value="Private PG (Rs. 50,000 - Rs. 90,000 / Year)">Private PG (Rs. 50,000 - Rs. 90,000 / Year)</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label font-weight-semibold">Preferred Interface Language</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="lang" id="langEn" value="en" checked={formData.preferredLang === 'en'} onChange={e => setFormData({ ...formData, preferredLang: e.target.value })} />
                      <label className="form-check-label font-weight-medium" htmlFor="langEn">English (Default)</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="lang" id="langGu" value="gu" checked={formData.preferredLang === 'gu'} onChange={e => setFormData({ ...formData, preferredLang: e.target.value })} />
                      <label className="form-check-label font-weight-medium" htmlFor="langGu">ગુજરાતી (Gujarati)</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="lang" id="langHi" value="hi" checked={formData.preferredLang === 'hi'} onChange={e => setFormData({ ...formData, preferredLang: e.target.value })} />
                      <label className="form-check-label font-weight-medium" htmlFor="langHi">हिंदी (Hindi)</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Previous
                </button>
                <button className="btn btn-success btn-lg px-4 d-flex align-items-center gap-2" onClick={handleFinishWizard}>
                  <Sparkles size={18} /> {t('onboarding.btnGenerate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {/* Summary Banner */}
            <div className="card bg-white p-4 shadow-sm mb-4 border-0 border-start border-4 border-primary">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <h4 className="font-weight-bold mb-1">🎯 {t('onboarding.yourChecklist')}</h4>
                  <p className="text-muted mb-0 small">
                    Target: <strong>{formData.course}</strong> in <strong>{formData.district}</strong> ({formData.collegeType} College)
                  </p>
                </div>
                <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={() => setStep(1)}>
                  <RefreshCw size={14} /> Edit Preferences
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="d-flex justify-content-between small font-weight-bold mb-1">
                  <span>{t('onboarding.progress')}: {completedCount} / {checklist.length} Completed</span>
                  <span className="text-primary">{progressPct}%</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div className="progress-bar bg-success progress-bar-striped" role="progressbar" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
            </div>

            {/* Checklist items list */}
            <div className="card shadow-sm p-4 border-0">
              <h5 className="font-weight-bold mb-3">Action Items</h5>
              <div className="list-group">
                {checklist.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 border-0 rounded-3 mb-2 ${
                      item.completed ? 'bg-light text-decoration-line-through text-muted' : 'bg-white border'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      {item.completed ? (
                        <CheckCircle2 size={24} className="text-success flex-shrink-0" />
                      ) : (
                        <Circle size={24} className="text-secondary flex-shrink-0" />
                      )}
                      <div>
                        <span className="font-weight-semibold d-block text-dark">{item.title}</span>
                        <span className="badge bg-secondary-subtle text-secondary small">{item.category}</span>
                      </div>
                    </div>
                    <span className={`badge ${item.completed ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {item.completed ? t('onboarding.completed') : t('onboarding.pending')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
