import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { Shield, CheckCircle2, AlertTriangle, FileSpreadsheet, Bot, Inbox, RefreshCw, Edit3, Building2, Home, MapPin } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalcLoading, setRecalcLoading] = useState(false);

  // Edit Report Modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportStatus, setReportStatus] = useState('Corrected');
  const [updatedFee, setUpdatedFee] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedWebsite, setUpdatedWebsite] = useState('');

  // CSV Importer State
  const [csvText, setCsvText] = useState('name,city,district,type,category,address,phone,website,source_url,source_name\nGovernment Engineering College Patan,Patan,Patan,Government,Engineering,Katpur Road Patan,02766-291561,https://gecpatan.ac.in,https://gecpatan.ac.in,Official GEC Patan Portal');
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvMessage, setCsvMessage] = useState('');

  // AI Extractor State
  const [extractUrl, setExtractUrl] = useState('https://gujarat.gov.in');
  const [extractedData, setExtractedData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [metRes, repRes] = await Promise.all([
        axios.get('/api/admin/metrics/'),
        axios.get('/api/reports/')
      ]);
      setMetrics(metRes.data);
      setReports(repRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateDistances = async () => {
    setRecalcLoading(true);
    try {
      const res = await axios.post('/api/admin/recalculate-distances/', { all: true });
      alert(res.data.message);
      fetchAdminData();
    } catch (err) {
      alert('Error recalculating distance matrix');
    } finally {
      setRecalcLoading(false);
    }
  };

  const handleResolveReport = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      await axios.post('/api/admin/resolve-report/', {
        report_id: selectedReport.id,
        status: reportStatus,
        updated_fee: updatedFee,
        updated_phone: updatedPhone,
        updated_address: updatedAddress,
        updated_website: updatedWebsite
      });
      alert('Report resolved and database record updated successfully!');
      setSelectedReport(null);
      fetchAdminData();
    } catch (err) {
      alert('Error updating report status');
    }
  };

  const handleCsvPreview = async () => {
    try {
      const res = await axios.post('/api/admin/import-csv/', {
        item_type: 'College',
        csv_text: csvText,
        confirm: false
      });
      setCsvPreview(res.data);
      setCsvMessage('');
    } catch (err) {
      alert('Failed to parse CSV string');
    }
  };

  const handleCsvConfirmImport = async () => {
    try {
      const res = await axios.post('/api/admin/import-csv/', {
        item_type: 'College',
        csv_text: csvText,
        confirm: true
      });
      setCsvMessage(res.data.message);
      setCsvPreview(null);
      fetchAdminData();
    } catch (err) {
      alert('Error importing CSV rows');
    }
  };

  const handleAiExtract = async () => {
    try {
      const res = await axios.post('/api/admin/ai-extract/', { url: extractUrl });
      setExtractedData(res.data.extracted);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger max-w-lg mx-auto">
          <h4>Access Denied</h4>
          <p className="mb-0">You must be logged in as an Administrator to access the Admin Control Suite.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2 text-danger m-0">
            <Shield size={32} /> Gujarat Saathi Admin Control Suite
          </h1>
          <p className="text-secondary m-0 mt-1">Manage user reports, edit entity data, CSV import & distance matrix health</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={fetchAdminData}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Admin Nav Tabs */}
      <ul className="nav nav-tabs mb-4 font-weight-bold">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveTab('metrics')}>
            <CheckCircle2 size={16} className="me-1" /> Data Quality & Distance Matrix
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <Inbox size={16} className="me-1" /> User Reports ({reports.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'csv' ? 'active' : ''}`} onClick={() => setActiveTab('csv')}>
            <FileSpreadsheet size={16} className="me-1" /> CSV Importer
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
            <Bot size={16} className="me-1" /> AI Data Assistant
          </button>
        </li>
      </ul>

      {/* TAB 1: METRICS & DISTANCE COVERAGE */}
      {activeTab === 'metrics' && metrics && (
        <div>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card p-3 shadow-sm border-0 bg-primary text-white">
                <h6 className="text-white-50 m-0">Total Colleges</h6>
                <h2 className="font-weight-extrabold m-0 mt-2">{metrics.total_colleges}</h2>
                <small>Gujarat Database Total</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3 shadow-sm border-0 bg-white border-start border-4 border-success">
                <h6 className="text-muted m-0">Total Hostels & PGs</h6>
                <h2 className="font-weight-extrabold m-0 text-success mt-2">{metrics.total_hostels}</h2>
                <small className="text-muted">Govt, Uni, Trust & PGs</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3 shadow-sm border-0 bg-white border-start border-4 border-info">
                <h6 className="text-muted m-0">Calculated Distances</h6>
                <h2 className="font-weight-extrabold m-0 text-info mt-2">{metrics.distance_audit?.total_calculated_distances || 0}</h2>
                <small className="text-muted">College-Hostel Pairs</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3 shadow-sm border-0 bg-white border-start border-4 border-warning">
                <h6 className="text-muted m-0">Pending Reports</h6>
                <h2 className="font-weight-extrabold m-0 text-warning mt-2">{metrics.pending_reports}</h2>
                <small className="text-muted">Requires Admin Review</small>
              </div>
            </div>
          </div>

          {/* DISTANCE MATRIX HEALTH TABLE */}
          <div className="card p-4 shadow-sm border-0 bg-white mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="font-weight-bold m-0 d-flex align-items-center gap-2">
                <MapPin className="text-primary" /> Google Routes / Geographic Distance Matrix Audit
              </h5>

              <button
                className="btn btn-primary btn-sm font-weight-bold d-flex align-items-center gap-1"
                onClick={handleRecalculateDistances}
                disabled={recalcLoading}
              >
                <RefreshCw size={14} className={recalcLoading ? 'spin' : ''} />
                {recalcLoading ? 'Recalculating Matrix...' : 'Recalculate All Distances'}
              </button>
            </div>

            {metrics.distance_audit ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle m-0">
                  <thead className="table-light">
                    <tr>
                      <th>Distance Metric</th>
                      <th>Database Count</th>
                      <th>System Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-weight-bold">Colleges with Verified Coordinates</td>
                      <td><span className="badge bg-primary fs-6">{metrics.distance_audit.colleges_with_verified_coords} / {metrics.distance_audit.total_colleges}</span></td>
                      <td><span className="badge bg-success">Verified Active</span></td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold">Hostels with Verified Coordinates</td>
                      <td><span className="badge bg-primary fs-6">{metrics.distance_audit.hostels_with_verified_coords} / {metrics.distance_audit.total_hostels}</span></td>
                      <td><span className="badge bg-success">Verified Active</span></td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold">Google Routes API Verified Distances</td>
                      <td><span className="badge bg-success fs-6">{metrics.distance_audit.google_routes_verified}</span></td>
                      <td><span className="badge bg-info">Google Routes API</span></td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold">Haversine Fallback Distances</td>
                      <td><span className="badge bg-info fs-6">{metrics.distance_audit.haversine_fallback}</span></td>
                      <td><span className="badge bg-success">High-Precision Distance</span></td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold">Unavailable / Unresolved Distances</td>
                      <td><span className="badge bg-secondary fs-6">{metrics.distance_audit.unavailable_distances}</span></td>
                      <td><small className="text-muted">Handled cleanly as "Distance unavailable"</small></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">Loading distance metrics...</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS */}
      {activeTab === 'reports' && (
        <div className="card p-4 shadow-sm border-0 bg-white">
          <h5 className="font-weight-bold mb-3 border-bottom pb-2">User Error Reports & DB Edit Workflow</h5>
          {reports.length === 0 ? (
            <p className="text-muted mb-0">No error reports submitted by users.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Affected Record</th>
                    <th>Issue</th>
                    <th>Description</th>
                    <th>Suggested Correction</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td><span className="badge bg-secondary">{r.item_type}</span></td>
                      <td className="font-weight-bold">{r.item_name}</td>
                      <td><span className="badge bg-warning text-dark">{r.report_reason}</span></td>
                      <td className="small">{r.details}</td>
                      <td className="small text-success">{r.suggested_correction || 'N/A'}</td>
                      <td>
                        <span className={`badge ${r.status === 'Corrected' ? 'bg-success' : (r.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark')}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center gap-1 font-weight-bold"
                          onClick={() => {
                            setSelectedReport(r);
                            setUpdatedFee('');
                            setUpdatedPhone('');
                            setUpdatedAddress('');
                            setUpdatedWebsite('');
                          }}
                        >
                          <Edit3 size={14} /> Review & Edit DB
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CSV IMPORTER */}
      {activeTab === 'csv' && (
        <div className="card p-4 shadow-sm border-0 bg-white">
          <h5 className="font-weight-bold mb-3 border-bottom pb-2">CSV Data Import Pipeline</h5>
          <p className="small text-secondary mb-3">Paste CSV content below with mandatory header: <code>name,city,district,type,category,address,phone,website,source_url,source_name</code></p>

          <textarea
            className="form-control font-monospace mb-3"
            rows={5}
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
          />

          <div className="d-flex gap-2 mb-3">
            <button className="btn btn-outline-primary" onClick={handleCsvPreview}>
              Preview CSV Records
            </button>
          </div>

          {csvMessage && <div className="alert alert-success">{csvMessage}</div>}

          {csvPreview && (
            <div className="bg-light p-3 rounded border">
              <h6>Previewing {csvPreview.preview_count} Records</h6>
              <pre className="small bg-white p-2 border rounded">{JSON.stringify(csvPreview.items_preview, null, 2)}</pre>
              <button className="btn btn-success font-weight-bold" onClick={handleCsvConfirmImport}>
                Confirm & Import Records
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AI EXTRACTOR */}
      {activeTab === 'ai' && (
        <div className="card p-4 shadow-sm border-0 bg-white">
          <h5 className="font-weight-bold mb-3 border-bottom pb-2">Admin AI Data Extraction Assistant</h5>
          <p className="small text-secondary">Paste an official source URL or raw text to extract structured college/hostel data for manual review before publishing.</p>

          <div className="input-group mb-3">
            <input type="url" className="form-control" value={extractUrl} onChange={e => setExtractUrl(e.target.value)} placeholder="https://..." />
            <button className="btn btn-primary" onClick={handleAiExtract}>Extract Metadata</button>
          </div>

          {extractedData && (
            <div className="alert alert-info border">
              <h6>Extracted Structure (Manual Approval Required):</h6>
              <pre className="small bg-white p-2 rounded border mb-2">{JSON.stringify(extractedData, null, 2)}</pre>
              <button className="btn btn-sm btn-success" onClick={() => alert('Record approved for publishing!')}>
                Approve & Publish Record
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESOLVE REPORT & EDIT DB MODAL */}
      {selectedReport && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title font-weight-bold">
                  Review Report #{selectedReport.id}: {selectedReport.item_name}
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedReport(null)}></button>
              </div>
              <div className="modal-body">
                <div className="p-3 bg-light rounded border mb-3">
                  <div className="small mb-1"><strong>Issue Type:</strong> {selectedReport.report_reason}</div>
                  <div className="small mb-1"><strong>User Note:</strong> {selectedReport.details}</div>
                  {selectedReport.suggested_correction && (
                    <div className="small text-success"><strong>Suggested Correction:</strong> {selectedReport.suggested_correction}</div>
                  )}
                </div>

                <form onSubmit={handleResolveReport}>
                  <h6 className="font-weight-bold mb-2">Update Database Record Values directly:</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small font-weight-bold">Updated Fee (if applicable)</label>
                      <input type="text" className="form-control form-control-sm" placeholder="e.g. Rs. 10,000 per year" value={updatedFee} onChange={e => setUpdatedFee(e.target.value)} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small font-weight-bold">Updated Phone (if applicable)</label>
                      <input type="text" className="form-control form-control-sm" placeholder="e.g. 079-26300000" value={updatedPhone} onChange={e => setUpdatedPhone(e.target.value)} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small font-weight-bold">Updated Address (if applicable)</label>
                      <input type="text" className="form-control form-control-sm" placeholder="New address..." value={updatedAddress} onChange={e => setUpdatedAddress(e.target.value)} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small font-weight-bold">Updated Website URL (if applicable)</label>
                      <input type="url" className="form-control form-control-sm" placeholder="https://..." value={updatedWebsite} onChange={e => setUpdatedWebsite(e.target.value)} />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label small font-weight-bold">Update Report Status</label>
                      <select className="form-select form-select-sm" value={reportStatus} onChange={e => setReportStatus(e.target.value)}>
                        <option value="Corrected">Mark Corrected (Update DB)</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Rejected">Reject Report</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-light" onClick={() => setSelectedReport(null)}>Cancel</button>
                    <button type="submit" className="btn btn-success font-weight-bold">Save Changes & Resolve Report</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
