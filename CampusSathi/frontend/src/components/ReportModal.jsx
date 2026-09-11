import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Send } from 'lucide-react';

const ReportModal = ({ show, onHide, itemName, itemType, itemId }) => {
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState('');
  const [reason, setReason] = useState('Fee is incorrect');
  const [details, setDetails] = useState('');
  const [suggestedCorrection, setSuggestedCorrection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/reports/', {
        user_email: userEmail,
        item_type: itemType || 'General',
        item_id: itemId || 0,
        item_name: itemName || 'Database Record',
        report_reason: reason,
        details: details,
        suggested_correction: suggestedCorrection,
        status: 'Pending'
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        setSuggestedCorrection('');
        onHide();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block tab-index-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header">
            <h5 className="modal-title font-weight-bold d-flex align-items-center gap-2 m-0 text-warning">
              <AlertTriangle size={20} />
              Report Wrong Information
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            {submitted ? (
              <div className="alert alert-success text-center my-3">
                ✓ Report submitted successfully! Our administrators will review and correct the database.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label font-weight-bold">Reporting for Record</label>
                  <input type="text" className="form-control" value={itemName || 'General Information'} disabled />
                </div>

                <div className="mb-3">
                  <label className="form-label font-weight-bold">What is wrong?</label>
                  <select className="form-select" value={reason} onChange={e => setReason(e.target.value)}>
                    <option value="Fee is incorrect">Fee is incorrect</option>
                    <option value="Address is incorrect">Address is incorrect</option>
                    <option value="Phone number is incorrect">Phone number is incorrect</option>
                    <option value="Website/link is incorrect">Website/link is incorrect</option>
                    <option value="Hostel information is incorrect">Hostel information is incorrect</option>
                    <option value="College information is incorrect">College information is incorrect</option>
                    <option value="Scholarship information is incorrect">Scholarship information is incorrect</option>
                    <option value="Course information is incorrect">Course information is incorrect</option>
                    <option value="Eligibility is incorrect">Eligibility is incorrect</option>
                    <option value="Information is outdated">Information is outdated</option>
                    <option value="Hostel is closed/not available">Hostel is closed/not available</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label font-weight-bold">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Please explain what information is incorrect..."
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label font-weight-bold">Suggested Correct Information (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="If you know the correct information, enter it here..."
                    value={suggestedCorrection}
                    onChange={e => setSuggestedCorrection(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Email (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light" onClick={onHide}>{t('common.cancel')}</button>
                  <button type="submit" className="btn btn-warning text-dark font-weight-bold d-flex align-items-center gap-1" disabled={loading}>
                    <Send size={16} /> {loading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
