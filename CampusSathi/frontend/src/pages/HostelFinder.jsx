import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, MapPin, Phone, ExternalLink, Filter, Search, ChevronLeft, ChevronRight, AlertCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import ReportModal from '../components/ReportModal';

const HostelFinder = () => {
  const { t } = useTranslation();

  const [hostels, setHostels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [accommodationType, setAccommodationType] = useState('');
  const [hostelType, setHostelType] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [hasFood, setHasFood] = useState(false);
  const [hasWifi, setHasWifi] = useState(false);
  const [hasAc, setHasAc] = useState(false);

  // Report Modal State
  const [reportHostel, setReportHostel] = useState(null);

  useEffect(() => {
    fetchHostels(1);
  }, [query, selectedCity, accommodationType, hostelType, genderFilter, hasFood, hasWifi, hasAc]);

  const fetchHostels = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      let url = `/api/hostels/?page=${page}&page_size=12&`;
      if (query) url += `query=${encodeURIComponent(query)}&`;
      if (selectedCity) url += `city=${encodeURIComponent(selectedCity)}&`;
      if (accommodationType) url += `accommodation_type=${encodeURIComponent(accommodationType)}&`;
      if (hostelType) url += `hostel_type=${encodeURIComponent(hostelType)}&`;
      if (genderFilter && genderFilter !== 'All') url += `gender=${encodeURIComponent(genderFilter)}&`;
      if (hasFood) url += `has_food=true&`;
      if (hasWifi) url += `has_wifi=true&`;
      if (hasAc) url += `has_ac=true&`;

      const res = await axios.get(url);
      if (res.data && Array.isArray(res.data.results)) {
        setHostels(res.data.results);
        setTotalCount(res.data.count);
        setTotalPages(res.data.total_pages || 1);
      } else if (Array.isArray(res.data)) {
        setHostels(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch hostels:', err);
      setHostels([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchHostels(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCity('');
    setAccommodationType('');
    setHostelType('');
    setGenderFilter('All');
    setHasFood(false);
    setHasWifi(false);
    setHasAc(false);
  };

  return (
    <div className="container py-4">
      {/* HEADER & LIVE RESULT COUNT */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2 m-0 text-primary">
            <Home /> {t('hostels.title')}
          </h1>
          <p className="text-secondary m-0 mt-1">{t('hostels.subtitle')}</p>
        </div>

        {/* Live Database Result Count Header */}
        <div className="bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill font-weight-bold d-flex align-items-center gap-2">
          <span>📍 {selectedCity || 'Gujarat'}</span>
          <span>•</span>
          <span>{totalCount} {totalCount === 1 ? 'hostel & PG' : 'hostels & PGs'} found</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="card shadow-sm p-3 mb-4 border-0">
        <div className="row g-3">
          {/* Search Query */}
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text border-end-0"><Search size={16} /></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search hostel name, area, facility..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* City Filter */}
          <div className="col-md-3">
            <select className="form-select" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
              <option value="">City: All Gujarat</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Vadodara">Vadodara</option>
            </select>
          </div>

          {/* Accommodation Type Filter */}
          <div className="col-md-2">
            <select className="form-select" value={accommodationType} onChange={e => setAccommodationType(e.target.value)}>
              <option value="">Type: All</option>
              <option value="Hostel">Student Hostel</option>
              <option value="PG">Paying Guest (PG)</option>
              <option value="Chhatralaya">Samaj Chhatralaya</option>
              <option value="Student Residence">Student Residence</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="col-md-2">
            <select className="form-select" value={hostelType} onChange={e => setHostelType(e.target.value)}>
              <option value="">Category: All</option>
              <option value="Government">Government</option>
              <option value="University">University Campus</option>
              <option value="College">College Hostel</option>
              <option value="Trust/Community">Trust / Samaj</option>
              <option value="Private">Private Hostel</option>
              <option value="Student PG">Student PG</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="col-md-2">
            <select className="form-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option value="All">Gender: All</option>
              <option value="Boys">Boys Only</option>
              <option value="Girls">Girls Only</option>
              <option value="Co-Ed">Co-Ed</option>
            </select>
          </div>
        </div>

        {/* Amenities Checkboxes */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3 pt-3 border-top">
          <div className="d-flex flex-wrap gap-4 align-items-center">
            <span className="small font-weight-bold text-secondary">Amenities:</span>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chkFood" checked={hasFood} onChange={e => setHasFood(e.target.checked)} />
              <label className="form-check-label small" htmlFor="chkFood">🍱 Mess / Food Included</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chkWifi" checked={hasWifi} onChange={e => setHasWifi(e.target.checked)} />
              <label className="form-check-label small" htmlFor="chkWifi">📶 Wi-Fi</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chkAc" checked={hasAc} onChange={e => setHasAc(e.target.checked)} />
              <label className="form-check-label small" htmlFor="chkAc">❄️ AC Rooms</label>
            </div>
          </div>

          {(query || selectedCity || accommodationType || hostelType || genderFilter !== 'All' || hasFood || hasWifi || hasAc) && (
            <button className="btn btn-link btn-sm text-danger text-decoration-none p-0" onClick={clearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* HOSTELS GRID */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : hostels.length === 0 ? (
        <div className="alert alert-warning text-center py-4 my-4">
          <h5>No hostels or PGs found matching your search</h5>
          <p className="mb-2">Try adjusting your filters or clearing search terms.</p>
          <button className="btn btn-outline-primary btn-sm" onClick={clearFilters}>Reset Filters</button>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {hostels.map(h => (
              <div className="col-md-6 col-lg-4" key={h.id}>
                <div className="card h-100 p-3 border shadow-sm">
                  {/* Badges Bar */}
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex gap-1">
                      <span className={`badge ${h.gender === 'Boys' ? 'bg-primary' : (h.gender === 'Girls' ? 'bg-danger' : 'bg-success')}`}>
                        {h.gender}
                      </span>
                      <span className="badge bg-secondary">
                        {h.accommodation_type || h.hostel_type}
                      </span>
                    </div>

                    <span className="small text-muted d-flex align-items-center gap-1 font-weight-medium">
                      <MapPin size={12} /> {h.area || h.city}, {h.district}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h5 className="font-weight-bold mb-1">{h.name}</h5>
                  <p className="small text-muted mb-2">{h.hostel_type} • {h.address}</p>

                  {/* Fee Section */}
                  <div className="p-2 rounded bg-light border mb-2">
                    <span className="small text-muted">Approx Fee Structure:</span>
                    <div className="font-weight-bold text-success fs-6">
                      {h.annual_fee_approx || 'Fee information not available'}
                    </div>
                    {h.fee_notes && <div className="small text-muted text-truncate">{h.fee_notes}</div>}
                  </div>

                  {/* Facilities Badges */}
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {h.has_food && <span className="badge bg-light text-dark border">🍱 Food Mess</span>}
                    {h.has_wifi && <span className="badge bg-light text-dark border">📶 Wi-Fi</span>}
                    {h.has_ac && <span className="badge bg-light text-dark border">❄️ AC</span>}
                    {h.has_laundry && <span className="badge bg-light text-dark border">🧺 Laundry</span>}
                    {h.curfew_time && <span className="badge bg-light text-dark border">⏰ Curfew {h.curfew_time}</span>}
                  </div>

                  {/* Distance info if available */}
                  {h.distance_to_top_colleges && (
                    <div className="small text-secondary mb-3">
                      <strong>Location Proximity:</strong> {h.distance_to_top_colleges}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-3 border-top d-flex flex-column gap-2">
                    <div className="d-flex gap-2">
                      {h.contact_phone && (
                        <a href={`tel:${h.contact_phone}`} className="btn btn-outline-primary btn-sm flex-grow-1 font-weight-bold d-flex align-items-center justify-content-center gap-1">
                          <Phone size={14} /> Call {h.contact_phone}
                        </a>
                      )}

                      {h.website && (
                        <a href={h.website} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm" title="Official Website">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    <button
                      className="btn btn-link btn-sm text-danger text-decoration-none p-0 d-flex align-items-center justify-content-center gap-1 mt-1"
                      onClick={() => setReportHostel(h)}
                    >
                      <ShieldAlert size={12} /> Report Wrong Information
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE SERVER-SIDE PAGINATION */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
              <span className="small text-muted">
                Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalCount} Total Hostels & PGs)
              </span>

              <ul className="pagination pagination-sm m-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-item-btn btn btn-outline-secondary btn-sm me-1" onClick={() => handlePageChange(currentPage - 1)}>
                    <ChevronLeft size={16} /> Prev
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <li key={pageNum} className="page-item">
                    <button
                      className={`btn btn-sm me-1 ${pageNum === currentPage ? 'btn-primary font-weight-bold' : 'btn-outline-secondary'}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-item-btn btn btn-outline-secondary btn-sm ms-1" onClick={() => handlePageChange(currentPage + 1)}>
                    Next <ChevronRight size={16} />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      {/* REPORT WRONG INFORMATION MODAL */}
      {reportHostel && (
        <ReportModal
          itemType="Hostel"
          itemId={reportHostel.id}
          itemName={reportHostel.name}
          onClose={() => setReportHostel(null)}
        />
      )}
    </div>
  );
};

export default HostelFinder;
