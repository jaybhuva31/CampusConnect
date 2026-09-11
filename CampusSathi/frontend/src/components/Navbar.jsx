import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, Globe, User as UserIcon, LogOut, Bookmark, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    localStorage.setItem('preferredLanguage', lng);
    i18n.changeLanguage(lng);
  };

  const getLanguageLabel = () => {
    switch (i18n.language) {
      case 'gu':
        return 'ગુજરાતી';
      case 'hi':
        return 'हिंदी';
      default:
        return 'English';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top py-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      <div className="container-fluid px-3 px-md-4">
        {/* Left: Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: '1.6rem' }}>🎓</span>
          <span className="font-weight-bold" style={{ color: 'var(--text-primary)' }}>Gujarat Student Saathi</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 p-1"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: 'var(--text-primary)' }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navbar Collapsible Content */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          {/* Center: Main Navigation */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 font-weight-medium text-center text-lg-start">
            <li className="nav-item">
              <Link className="nav-link px-2" to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.home')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/colleges" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.colleges')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/courses" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.courses')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/admission" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.admission')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/hostels" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.hostels')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/scholarships" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.scholarships')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/study-hub" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.studyHub')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/ask-senior" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>{t('nav.askSenior')}</Link>
            </li>
          </ul>

          {/* Right: Controls (Language Selector, Theme Switch, Login/User) */}
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-end gap-2 mt-2 mt-lg-0">
            {/* Language Selector Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                <Globe size={16} />
                <span>{getLanguageLabel()}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ backgroundColor: 'var(--card-bg)' }}>
                <li>
                  <button className="dropdown-item" onClick={() => { changeLanguage('en'); setMobileMenuOpen(false); }} style={{ color: 'var(--text-primary)' }}>
                    English
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => { changeLanguage('gu'); setMobileMenuOpen(false); }} style={{ color: 'var(--text-primary)' }}>
                    ગુજરાતી
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => { changeLanguage('hi'); setMobileMenuOpen(false); }} style={{ color: 'var(--text-primary)' }}>
                    हिंदी
                  </button>
                </li>
              </ul>
            </div>

            {/* Theme Switcher Button */}
            <button
              className="btn border d-flex align-items-center justify-content-center p-2"
              onClick={toggleTheme}
              title="Toggle Light/Dark Theme"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-warning" />}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <UserIcon size={16} />
                  <span>{user.first_name || user.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>
                      <UserIcon size={14} /> {t('nav.dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/saved" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)' }}>
                      <Bookmark size={14} /> {t('nav.saved')}
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 text-danger" to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Shield size={14} /> {t('nav.admin')}
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      <LogOut size={14} /> {t('nav.logout')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary" onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>{t('nav.register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
