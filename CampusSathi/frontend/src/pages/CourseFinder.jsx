import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';

const CourseFinder = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [query, category]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let url = '/api/courses/?';
      if (query) url += `query=${encodeURIComponent(query)}&`;
      if (category) url += `category=${encodeURIComponent(category)}&`;

      const res = await axios.get(url);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Engineering', 'IT & Computers', 'Commerce', 'Management', 'Science', 'Pharmacy', 'Diploma'
  ];

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
          <BookOpen className="text-primary" /> What Should I Study? (Gujarat Course Finder)
        </h1>
        <p className="text-secondary">Explore undergraduate degree, diploma, and professional programs in Gujarat</p>
      </div>

      {/* Filter Category Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn btn-sm ${category === '' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setCategory('')}
        >
          All Programs
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="card shadow-sm p-3 mb-4 border-0">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search course name (Computer, BBA, B.Com, Pharmacy)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map(c => (
            <div className="col-md-6 col-lg-4" key={c.id}>
              <div className="card h-100 p-4 border-0 shadow-sm">
                <span className="badge bg-primary-subtle text-primary align-self-start mb-2 font-weight-bold">
                  {c.category}
                </span>
                <h5 className="font-weight-bold mb-2">{c.name}</h5>
                <div className="small text-muted mb-2">
                  <strong>Duration:</strong> {c.duration_years}
                </div>
                <p className="small text-secondary mb-3">
                  <strong>Eligibility:</strong> {c.eligibility}
                </p>

                <div className="bg-light p-2 rounded small mb-3">
                  <strong>Typical Subjects:</strong> {c.typical_subjects || 'Core stream subjects'}
                </div>

                <div className="mt-auto pt-2 border-top">
                  <Link to={`/colleges?course=${encodeURIComponent(c.name)}`} className="btn btn-outline-primary btn-sm w-100">
                    Find Colleges Offering This Course <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseFinder;
