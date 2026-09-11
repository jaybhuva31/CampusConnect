import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Luggage, Printer } from 'lucide-react';

const HostelPackingList = () => {
  const { t } = useTranslation();

  const [items, setItems] = useState([
    { id: 1, name: 'Bedsheets (2 Pairs) & Pillow Cover', category: 'Bedding', packed: true },
    { id: 2, name: 'Light Blanket / Chaddar', category: 'Bedding', packed: true },
    { id: 3, name: 'Bucket, Mug & Soap Dish', category: 'Bathroom', packed: false },
    { id: 4, name: 'Toothbrush, Paste, Shampoo & Soap', category: 'Bathroom', packed: true },
    { id: 5, name: 'Towel (2 Copies)', category: 'Bathroom', packed: true },
    { id: 6, name: 'Padlock with Duplicate Keys (2 Sets)', category: 'Security', packed: false },
    { id: 7, name: 'Laptop, Charger & Power Extension Board', category: 'Electronics', packed: true },
    { id: 8, name: 'Mobile Charger & Power Bank', category: 'Electronics', packed: true },
    { id: 9, name: 'Water Bottle & Stainless Steel Plate/Spoon', category: 'Daily Use', packed: false },
    { id: 10, name: 'Basic Medicines (Paracetamol, Bandage, ORS)', category: 'Medical', packed: false },
    { id: 11, name: 'College Admission Letter & Photo IDs', category: 'Documents', packed: true },
    { id: 12, name: 'Passport Photos (10 Copies)', category: 'Documents', packed: true },
    { id: 13, name: 'Hangers & Cloth Clips', category: 'Daily Use', packed: false },
    { id: 14, name: 'Umbrella / Raincoat (Monsoon Season)', category: 'Daily Use', packed: false },
  ]);

  const togglePacked = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const packedCount = items.filter(i => i.packed).length;
  const pct = Math.round((packedCount / items.length) * 100);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="font-weight-extrabold d-flex align-items-center gap-2">
            <Luggage className="text-warning" /> What Should I Take to Hostel?
          </h1>
          <p className="text-secondary mb-0">Interactive first-year packing checklist for college hostel joining in Gujarat</p>
        </div>

        <button className="btn btn-outline-secondary d-flex align-items-center gap-1" onClick={() => window.print()}>
          <Printer size={16} /> Print Checklist
        </button>
      </div>

      {/* Progress Counter Card */}
      <div className="card shadow-sm p-4 border-0 mb-4 bg-white border-start border-4 border-success">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="font-weight-bold m-0">Packing Progress</h5>
          <span className="badge bg-success text-white font-weight-bold fs-6">{packedCount} / {items.length} Packed ({pct}%)</span>
        </div>
        <div className="progress" style={{ height: '12px' }}>
          <div className="progress-bar bg-success" style={{ width: `${pct}%` }}></div>
        </div>
      </div>

      {/* Items list */}
      <div className="row g-3">
        {items.map(item => (
          <div className="col-md-6" key={item.id}>
            <div
              onClick={() => togglePacked(item.id)}
              className={`card p-3 border-0 rounded-3 shadow-sm d-flex flex-row align-items-center justify-content-between ${
                item.packed ? 'bg-light text-muted text-decoration-line-through' : 'bg-white border'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center gap-3">
                {item.packed ? (
                  <CheckCircle2 size={24} className="text-success flex-shrink-0" />
                ) : (
                  <Circle size={24} className="text-secondary flex-shrink-0" />
                )}
                <div>
                  <span className="font-weight-bold d-block text-dark">{item.name}</span>
                  <span className="badge bg-secondary-subtle text-secondary small">{item.category}</span>
                </div>
              </div>
              <span className={`badge ${item.packed ? 'bg-success' : 'bg-secondary'}`}>
                {item.packed ? 'Packed' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostelPackingList;
