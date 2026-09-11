import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { Bookmark, Trash2, ArrowLeft } from 'lucide-react';

const SavedItems = () => {
  const { t } = useTranslation();
  const { user, savedItems, toggleSaveItem } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please login to view your saved bookmarks</h3>
        <Link to="/login" className="btn btn-primary mt-2">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
            <Bookmark className="text-primary" /> My Saved Items
          </h1>
          <p className="text-secondary mb-0">Your bookmarked colleges, hostels, and scholarships</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline-secondary d-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {savedItems.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          <h5>No saved bookmarks yet</h5>
          <p className="mb-0">Click the "Bookmark" button on any college or hostel card to save it here.</p>
        </div>
      ) : (
        <div className="row g-3">
          {savedItems.map(item => (
            <div className="col-md-6" key={item.id}>
              <div className="card p-3 shadow-sm border-0 d-flex flex-row align-items-center justify-content-between">
                <div>
                  <span className="badge bg-primary-subtle text-primary mb-1">{item.item_type}</span>
                  <h5 className="font-weight-bold mb-0">{item.item_name}</h5>
                </div>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => toggleSaveItem(item.item_type, item.item_id, item.item_name)}
                  title="Remove Bookmark"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItems;
