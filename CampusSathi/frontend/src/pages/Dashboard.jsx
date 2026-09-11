import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { User as UserIcon, Bookmark, CheckSquare, Bell, FileText } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserChecklist();
    }
  }, [user]);

  const fetchUserChecklist = async () => {
    try {
      const res = await axios.get(`/api/checklist/?user_id=${user.id}`);
      setChecklist(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please login to access your Student Dashboard</h3>
        <Link to="/login" className="btn btn-primary mt-2">Go to Login</Link>
      </div>
    );
  }

  const completedCount = checklist.filter(i => i.is_completed).length;
  const totalCount = checklist.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="card bg-white p-4 shadow-sm border-0 mb-4 border-start border-4 border-primary">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-primary mb-2">Student Profile</span>
            <h2 className="font-weight-extrabold m-0">Welcome, {user.first_name || user.username} 👋</h2>
            <p className="text-secondary mb-0">
              Role: <strong className="text-capitalize">{user.role}</strong> • District: <strong>{user.district || 'Gujarat'}</strong>
            </p>
          </div>
          <Link to="/saved" className="btn btn-outline-primary d-flex align-items-center gap-1">
            <Bookmark size={16} /> My Saved Bookmarks
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Checklist Progress */}
        <div className="col-lg-8">
          <div className="card shadow-sm p-4 border-0 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-weight-bold m-0 d-flex align-items-center gap-2">
                <CheckSquare className="text-primary" /> First-Year Progress Checklist
              </h5>
              <span className="badge bg-success">{progressPct}% Complete</span>
            </div>

            <div className="progress mb-4" style={{ height: '10px' }}>
              <div className="progress-bar bg-success" style={{ width: `${progressPct}%` }}></div>
            </div>

            {loading ? (
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            ) : (
              <div className="list-group">
                {checklist.map(item => (
                  <div key={item.id} className="list-group-item d-flex align-items-center justify-content-between p-3 border-0 bg-light mb-2 rounded">
                    <span>{item.item_title}</span>
                    <span className={`badge ${item.is_completed ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {item.is_completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-lg-4">
          <div className="card shadow-sm p-4 border-0 mb-4">
            <h5 className="font-weight-bold mb-3 border-bottom pb-2">Quick Actions</h5>
            <div className="d-flex flex-column gap-2">
              <Link to="/onboarding" className="btn btn-outline-primary text-start">
                ✨ Update Onboarding Preferences
              </Link>
              <Link to="/colleges" className="btn btn-outline-secondary text-start">
                🔎 Search Gujarat Colleges
              </Link>
              <Link to="/hostels" className="btn btn-outline-success text-start">
                🏠 Find Hostel / PG
              </Link>
              <Link to="/scholarships" className="btn btn-outline-warning text-dark text-start">
                🎓 Check Scholarship Deadlines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
