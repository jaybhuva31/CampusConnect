import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Home } from 'lucide-react';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-5 text-center">
      <div className="py-5">
        <span className="display-1 text-primary">404</span>
        <h2 className="font-weight-extrabold mt-3">Page Not Found</h2>
        <p className="text-secondary max-w-md mx-auto mb-4">
          The page or resource you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2">
          <Home size={18} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
