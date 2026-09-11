import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ExternalLink, AlertCircle, FileText, ArrowRight } from 'lucide-react';

const AdmissionGuide = () => {
  const { t } = useTranslation();

  const steps = [
    { step: 1, title: 'Check Eligibility Criteria', desc: 'Verify 12th Board marks (GSHSEB/CBSE), stream prerequisites, and GUJCET/JEE entrance rank requirement.' },
    { step: 2, title: 'Choose Program & Branch', desc: 'Select preferred course category (B.E., BCA, BBA, B.Com, B.Sc, Pharmacy, Medical, Diploma).' },
    { step: 3, title: 'Find Target Colleges across Gujarat', desc: 'Explore government, grant-in-aid, and private universities in your preferred district.' },
    { step: 4, title: 'Identify Admission Authority', desc: 'Check if your course requires GCAS Portal (gcas.gujgov.edu.in) or ACPC Technical Portal (gujacpc.admissions.nic.in).' },
    { step: 5, title: 'Prepare Mandatory Documents', desc: 'Gather 10th/12th marksheets, LC, Caste Certificate, Mamlatdar Income Proof, and Aadhaar card.' },
    { step: 6, title: 'Apply Online on Official Portal', desc: 'Create student registration profile, fill basic details, upload scanned documents, and pay registration fee.' },
    { step: 7, title: 'Fill College & Course Preferences', desc: 'Lock choice preferences before specified deadline in order of college priority.' },
    { step: 8, title: 'Check Merit Rank & Seat Allotment', desc: 'Track mock round & official allotment results published on the portal.' },
    { step: 9, title: 'Pay Token Admission Fee Online', desc: 'Confirm allotted seat by paying admission fee online within prescribed timeframe.' },
    { step: 10, title: 'Report to College & Hostel Joining', desc: 'Submit original document physical verification at college and report for orientation & hostel allotment.' },
  ];

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
          <FileText className="text-primary" /> Gujarat Step-by-Step Admission Guide 2026
        </h1>
        <p className="text-secondary">Complete 10-Step Roadmap for First-Year College Admissions across Gujarat</p>
      </div>

      {/* Official Portals Notice Card */}
      <div className="card shadow-sm p-4 border-0 mb-4 bg-primary text-white">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h4 className="font-weight-bold mb-2">🌐 Official Government Admission Portals</h4>
            <p className="mb-0 text-white-50">
              Never pay registration fees on unauthorized third-party sites. Always use official state portals.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0 d-flex flex-column gap-2">
            <a href="https://gcas.gujgov.edu.in" target="_blank" rel="noreferrer" className="btn btn-warning text-dark font-weight-bold d-flex align-items-center justify-content-center gap-1">
              GCAS Portal (gcas.gujgov.edu.in) <ExternalLink size={14} />
            </a>
            <a href="https://gujacpc.admissions.nic.in" target="_blank" rel="noreferrer" className="btn btn-light text-primary font-weight-bold d-flex align-items-center justify-content-center gap-1">
              ACPC Engineering Portal <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
        <AlertCircle size={20} className="flex-shrink-0" />
        <div>
          <strong>Important Note:</strong> Admission process may vary by university, course, or college type. Always confirm latest dates on official portals.
        </div>
      </div>

      {/* 10 Steps Roadmap */}
      <div className="row g-4">
        {steps.map(s => (
          <div className="col-md-6" key={s.step}>
            <div className="card h-100 p-4 border-0 shadow-sm border-start border-4 border-primary">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-primary text-white font-weight-bold px-3 py-2">
                  Step {s.step}
                </span>
                <CheckCircle size={20} className="text-success" />
              </div>
              <h5 className="font-weight-bold text-dark mb-2">{s.title}</h5>
              <p className="text-secondary small mb-0">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmissionGuide;
