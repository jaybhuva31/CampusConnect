import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Building2, ExternalLink, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import axios from 'axios';

const CollegeFinder = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [colleges, setColleges] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [collegeType, setCollegeType] = useState(searchParams.get('type') || '');

  useEffect(() => {
    fetchColleges(1);
  }, [query, selectedCity, selectedCategory, collegeType]);

  const fetchColleges = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      let url = `/api/colleges/?page=${page}&page_size=12&`;
      if (query) url += `query=${encodeURIComponent(query)}&`;
      if (selectedCity) url += `city=${encodeURIComponent(selectedCity)}&`;
      if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (collegeType) url += `college_type=${encodeURIComponent(collegeType)}&`;

      const res = await axios.get(url);
      if (res.data && Array.isArray(res.data.results)) {
        setColleges(res.data.results);
        setTotalCount(res.data.count);
        setTotalPages(res.data.total_pages || 1);
      } else if (Array.isArray(res.data)) {
        setColleges(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
      setColleges([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchColleges(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCity('');
    setSelectedCategory('');
    setCollegeType('');
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* HEADER & LIVE RESULT COUNT */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2 m-0">
            <Building2 className="text-primary" /> {t('colleges.title')}
          </h1>
          <p className="text-secondary m-0 mt-1">{t('colleges.subtitle')}</p>
        </div>

        {/* Live Database Result Count Header */}
        <div className="bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill font-weight-bold d-flex align-items-center gap-2">
          <span>📍 {selectedCity || 'Gujarat'}</span>
          <span>•</span>
          <span>{totalCount} {totalCount === 1 ? 'college' : 'colleges'} found</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="card shadow-sm p-3 mb-4 border-0">
        <div className="row g-3">
          {/* Search Box */}
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text border-end-0"><Search size={16} /></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search college, city, or stream..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Priority City Filter */}
          <div className="col-md-3">
            <select className="form-select" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
              <option value="">Select City: All Gujarat</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Gandhinagar">Gandhinagar</option>
            </select>
          </div>

          {/* Stream / Category Filter */}
          <div className="col-md-3">
            <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="">Category: All Streams</option>
              <option value="Engineering">Engineering & Technology</option>
              <option value="Commerce">Commerce & BBA</option>
              <option value="Science">Science & Research</option>
              <option value="Arts">Arts & Humanities</option>
              <option value="Management">Management & MBA</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Law">Law & Legal Studies</option>
              <option value="Computer Applications">Computer Applications (BCA/MCA)</option>
              <option value="Medicine">Medicine & Health</option>
              <option value="Polytechnic">Diploma Polytechnic</option>
              <option value="Architecture">Architecture & Design</option>
            </select>
          </div>

          {/* College Type Filter */}
          <div className="col-md-3">
            <select className="form-select" value={collegeType} onChange={e => setCollegeType(e.target.value)}>
              <option value="">College Type: All</option>
              <option value="Government">Government</option>
              <option value="Grant-in-Aid">Grant-in-Aid</option>
              <option value="Private">Private / Self-Finance</option>
              <option value="University Department">University Department</option>
            </select>
          </div>
        </div>

        {(query || selectedCity || selectedCategory || collegeType) && (
          <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
            <small className="text-muted">Active filters applied</small>
            <button className="btn btn-link btn-sm text-danger text-decoration-none p-0" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* RESULTS GRID */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="alert alert-warning text-center py-4 my-4">
          <h5>No colleges found matching your criteria</h5>
          <p className="mb-2">Try clearing your search query or selecting another category/city filter.</p>
          <button className="btn btn-outline-primary btn-sm" onClick={clearFilters}>Reset Filters</button>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {colleges.map(col => (
              <div className="col-md-6 col-lg-4" key={col.id}>
                <div className="card h-100 p-3 border shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className={`badge ${col.college_type === 'Government' ? 'bg-success' : (col.college_type === 'Grant-in-Aid' ? 'bg-info' : 'bg-primary')}`}>
                      {col.college_type}
                    </span>
                    <span className="small text-muted d-flex align-items-center gap-1 font-weight-medium">
                      <MapPin size={12} /> {col.city}, {col.district}
                    </span>
                  </div>

                  <h5 className="font-weight-bold mb-1">{col.name}</h5>
                  <p className="small text-muted mb-2">{col.university_name || 'State Recognized University'}</p>

                  <div className="d-flex flex-wrap gap-1 mb-2">
                    <span className="badge bg-secondary-subtle text-secondary border">
                      {col.institution_category || 'Higher Education'}
                    </span>
                  </div>

                  <div className="small text-secondary mb-3">
                    <strong>Admission Route:</strong> {col.admission_route || 'GCAS / ACPC Portal'}
                  </div>

                  <div className="mt-auto pt-3 border-top d-flex gap-2">
                    <Link to={`/college/${col.id}`} className="btn btn-primary btn-sm flex-grow-1 font-weight-bold">
                      View Details & Nearby Hostels
                    </Link>
                    {col.website && (
                      <a href={col.website} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm" title="Official Portal">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE SERVER-SIDE PAGINATION */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
              <span className="small text-muted">
                Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalCount} Total Colleges)
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
    </div>
  );
};

export default CollegeFinder;
