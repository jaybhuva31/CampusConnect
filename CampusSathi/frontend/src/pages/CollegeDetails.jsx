import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, ExternalLink, Bookmark, Building2, AlertTriangle, Home as HomeIcon, Filter, PhoneCall } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ReportModal from '../components/ReportModal';

const CollegeDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { toggleSaveItem, isSaved } = useContext(AuthContext);

  const [college, setCollege] = useState(null);
  const [nearbyHostels, setNearbyHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Nearby Hostel Filters
  const [genderFilter, setGenderFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('');
  const [foodFilter, setFoodFilter] = useState(false);
  const [wifiFilter, setWifiFilter] = useState(false);
  const [acFilter, setAcFilter] = useState(false);
  const [radius, setRadius] = useState(5.0);

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  useEffect(() => {
    if (college) {
      fetchNearbyHostels();
    }
  }, [college, genderFilter, typeFilter, foodFilter, wifiFilter, acFilter, radius]);

  const fetchCollegeDetails = async () => {
    try {
      const res = await axios.get(`/api/colleges/${id}/`);
      setCollege(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyHostels = async () => {
    setNearbyLoading(true);
    try {
      let url = `/api/colleges/${id}/nearby-hostels/?max_radius=${radius}&`;
      if (genderFilter && genderFilter !== 'All') url += `gender=${encodeURIComponent(genderFilter)}&`;
      if (typeFilter) url += `hostel_type=${encodeURIComponent(typeFilter)}&`;
      if (foodFilter) url += `has_food=true&`;
      if (wifiFilter) url += `has_wifi=true&`;
      if (acFilter) url += `has_ac=true&`;

      const res = await axios.get(url);
      setNearbyHostels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setNearbyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">{t('common.loading')}</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="container py-5 text-center">
        <h3>College record not found</h3>
        <Link to="/colleges" className="btn btn-primary mt-2">Back to College Finder</Link>
      </div>
    );
  }

  const bookmarked = isSaved('College', college.id);

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="card shadow-sm p-4 border-0 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary">{college.college_type}</span>
              <span className="badge bg-secondary">{college.gender_type}</span>
            </div>
            <h2 className="font-weight-extrabold mb-1">{college.name}</h2>
            <p className="text-secondary mb-0">
              {college.university_name} • 📍 {college.city}, {college.district}
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className={`btn ${bookmarked ? 'btn-success' : 'btn-outline-primary'} d-flex align-items-center gap-1`}
              onClick={() => toggleSaveItem('College', college.id, college.name)}
            >
              <Bookmark size={16} /> {bookmarked ? 'Bookmarked' : 'Save College'}
            </button>
            <button className="btn btn-outline-warning text-dark font-weight-bold d-flex align-items-center gap-1" onClick={() => setShowReport(true)}>
              <AlertTriangle size={16} /> Report Wrong Information
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Overview & Courses */}
        <div className="col-lg-8">
          {/* Overview */}
          <div className="card shadow-sm p-4 border-0 mb-4">
            <h5 className="font-weight-bold mb-3 border-bottom pb-2">Overview</h5>
            <p className="text-secondary">{college.overview || 'Higher education institute in Gujarat offering degree and diploma programs.'}</p>
            
            <div className="p-3 rounded border">
              <strong>Official Admission Route:</strong> {college.admission_route}
            </div>
          </div>

          {/* Courses Offered & Fee Structure (No Seats Column) */}
          <div className="card shadow-sm p-4 border-0 mb-4">
            <h5 className="font-weight-bold mb-3 border-bottom pb-2">Offered Programs & Fee Structure</h5>
            {college.offered_courses && college.offered_courses.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Course Program</th>
                      <th>Category</th>
                      <th>Annual Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.offered_courses.map(cc => (
                      <tr key={cc.id}>
                        <td className="font-weight-bold">{cc.course_name}</td>
                        <td>{cc.course_category}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success border">
                            {cc.annual_fee}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">Course fee information currently being updated.</p>
            )}
          </div>

          {/* 🏠 NEARBY HOSTELS & PGS SECTION */}
          <div className="card shadow-sm p-4 border-0 mb-4 bg-white border-start border-4 border-success">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 border-bottom pb-3">
              <div>
                <h4 className="font-weight-bold m-0 d-flex align-items-center gap-2 text-success">
                  <HomeIcon size={24} /> 🏠 Nearby Hostels & PGs
                </h4>
                <small className="text-muted">Hostels and student PGs located near {college.short_name || college.name}</small>
              </div>

              {/* Radius filter */}
              <div className="d-flex align-items-center gap-2">
                <label className="small font-weight-bold m-0 text-muted">Radius:</label>
                <select className="form-select form-select-sm" value={radius} onChange={e => setRadius(parseFloat(e.target.value))}>
                  <option value={3.0}>Within 3 km</option>
                  <option value={5.0}>Within 5 km</option>
                  <option value={10.0}>Within 10 km</option>
                </select>
              </div>
            </div>

            {/* Filters for nearby hostels */}
            <div className="row g-2 mb-3 p-2 rounded border">
              <div className="col-md-3">
                <select className="form-select form-select-sm" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                  <option value="All">Gender: All</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select form-select-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="">Type: All</option>
                  <option value="Government">Government Hostel</option>
                  <option value="College/University">College Hostel</option>
                  <option value="Trust/Community">Trust Hostel</option>
                  <option value="Student PG">Student PG</option>
                </select>
              </div>

              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="form-check form-check-inline m-0">
                  <input className="form-check-input" type="checkbox" id="foodCheck" checked={foodFilter} onChange={e => setFoodFilter(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="foodCheck">Food Included</label>
                </div>
                <div className="form-check form-check-inline m-0">
                  <input className="form-check-input" type="checkbox" id="wifiCheck" checked={wifiFilter} onChange={e => setWifiFilter(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="wifiCheck">Wi-Fi</label>
                </div>
                <div className="form-check form-check-inline m-0">
                  <input className="form-check-input" type="checkbox" id="acCheck" checked={acFilter} onChange={e => setAcFilter(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="acCheck">AC</label>
                </div>
              </div>
            </div>

            {/* Nearby Hostels Grid */}
            {nearbyLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                <span className="ms-2 small text-muted">📍 Calculating road & geographic distances...</span>
              </div>
            ) : nearbyHostels.length === 0 ? (
              <div className="alert alert-secondary text-center my-2 py-3 small">
                No nearby hostel or PG information available within {radius} km.
              </div>
            ) : (
              <div className="row g-3">
                {nearbyHostels.map(h => {
                  const distText = h.distance?.display || (h.calculated_distance_km ? `${h.calculated_distance_km} km from college` : 'Distance unavailable');
                  const mapUrl = h.google_map_url || `https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`;

                  return (
                    <div className="col-md-6" key={h.id}>
                      <div className="card p-3 border rounded shadow-sm h-100">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className={`badge ${distText === 'Distance unavailable' ? 'bg-secondary' : 'bg-success'} font-weight-bold`}>
                            📍 {distText}
                          </span>
                          <span className={`badge ${h.gender === 'Girls' ? 'bg-danger' : 'bg-primary'}`}>
                            {h.gender}
                          </span>
                        </div>

                        <h6 className="font-weight-bold mb-1">{h.name}</h6>
                        <small className="text-muted d-block mb-2">{h.hostel_type} • {h.area || h.city}</small>

                        <div className="small mb-2">
                          <strong>Fee:</strong> <span className="text-success font-weight-bold">{h.annual_fee_approx}</span>
                        </div>

                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {h.has_food && <span className="badge bg-light text-dark border">🍱 Food Mess</span>}
                          {h.has_wifi && <span className="badge bg-light text-dark border">📶 Wi-Fi</span>}
                          {h.has_ac && <span className="badge bg-light text-dark border">❄️ AC</span>}
                        </div>

                        <div className="mt-auto pt-2 border-top d-flex gap-2">
                          {h.contact_phone && (
                            <a href={`tel:${h.contact_phone}`} className="btn btn-sm btn-outline-primary flex-grow-1 font-weight-bold">
                              <PhoneCall size={12} className="me-1" /> Call
                            </a>
                          )}
                          <a href={mapUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary" title="Open Location in Google Maps">
                            <ExternalLink size={12} className="me-1" /> View Map
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact & Details */}
        <div className="col-lg-4">
          <div className="card shadow-sm p-4 border-0 mb-4">
            <h5 className="font-weight-bold mb-3 border-bottom pb-2">Institution Details</h5>
            
            <div className="mb-3">
              <span className="small text-muted d-block">Category / Stream</span>
              <strong className="text-primary">{college.institution_category}</strong>
            </div>

            <div className="mb-3">
              <span className="small text-muted d-block">Address</span>
              <span>{college.address}</span>
            </div>

            {college.phone && (
              <div className="mb-3">
                <span className="small text-muted d-block">Contact Phone</span>
                <a href={`tel:${college.phone}`} className="text-decoration-none font-weight-bold">
                  <Phone size={14} className="me-1" /> {college.phone}
                </a>
              </div>
            )}

            {college.website && (
              <div className="mb-3">
                <span className="small text-muted d-block">Official Website</span>
                <a href={college.website} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm mt-1 w-100 font-weight-bold">
                  <ExternalLink size={14} className="me-1" /> Official Portal
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <ReportModal
          itemType="College"
          itemId={college.id}
          itemName={college.name}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default CollegeDetails;
