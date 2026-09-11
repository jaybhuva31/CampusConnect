import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Lock, User as UserIcon } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login/', { username, password });
      login(res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-4 border-0 rounded-4 bg-white">
            <div className="text-center mb-4">
              <span className="display-5">🎓</span>
              <h3 className="font-weight-extrabold mt-2">Login to Gujarat Saathi</h3>
              <p className="text-muted small">Access your personalized checklist, saved colleges & hostels</p>
            </div>

            {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label font-weight-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text"><UserIcon size={16} /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label font-weight-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><Lock size={16} /></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 font-weight-bold" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-3 small text-muted">
              Don't have an account? <Link to="/register" className="font-weight-bold">Register Now</Link>
            </div>

            {/* Quick Demo Login Credentials Hint */}
            <div className="mt-4 p-3 bg-light rounded text-start small border">
              <strong>Demo Login Credentials:</strong>
              <div>Admin: <code>admin</code> / <code>admin123</code></div>
              <div>Senior: <code>rahul_patel</code> / <code>senior123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
