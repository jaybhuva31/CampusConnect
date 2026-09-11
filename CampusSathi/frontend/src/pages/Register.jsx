import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    district: 'Ahmedabad',
    preferred_language: 'en'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/register/', formData);
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-lg p-4 border-0 rounded-4 bg-white">
            <div className="text-center mb-4">
              <span className="display-5">🎓</span>
              <h3 className="font-weight-extrabold mt-2">Create Student Account</h3>
              <p className="text-muted small">Join Gujarat Student Saathi for free</p>
            </div>

            {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label font-weight-semibold">First Name</label>
                  <input type="text" className="form-control" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} required />
                </div>
                <div className="col-6">
                  <label className="form-label font-weight-semibold">Last Name</label>
                  <input type="text" className="form-control" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label font-weight-semibold">Username</label>
                  <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label font-weight-semibold">Email Address</label>
                  <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label font-weight-semibold">Password</label>
                  <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label font-weight-semibold">District in Gujarat</label>
                  <input type="text" className="form-control" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 font-weight-bold mt-4" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="text-center mt-3 small text-muted">
              Already have an account? <Link to="/login" className="font-weight-bold">Login Here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
