import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('saathi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('saathi_user', JSON.stringify(user));
      fetchSavedItems(user.id);
    } else {
      localStorage.removeItem('saathi_user');
      setSavedItems([]);
    }
  }, [user]);

  const fetchSavedItems = async (userId) => {
    try {
      const res = await axios.get(`/api/saved-items/?user_id=${userId}`);
      setSavedItems(res.data);
    } catch (err) {
      console.error('Failed to fetch saved items', err);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleSaveItem = async (itemType, itemId, itemName) => {
    if (!user) {
      alert('Please login to bookmark items!');
      return;
    }
    const existing = savedItems.find(i => i.item_type === itemType && i.item_id === itemId);
    if (existing) {
      try {
        await axios.delete(`/api/saved-items/${existing.id}/`);
        setSavedItems(prev => prev.filter(i => i.id !== existing.id));
      } catch (err) {
        console.error('Error removing bookmark', err);
      }
    } else {
      try {
        const res = await axios.post('/api/saved-items/', {
          user: user.id,
          item_type: itemType,
          item_id: itemId,
          item_name: itemName
        });
        setSavedItems(prev => [...prev, res.data]);
      } catch (err) {
        console.error('Error adding bookmark', err);
      }
    }
  };

  const isSaved = (itemType, itemId) => {
    return savedItems.some(i => i.item_type === itemType && i.item_id === itemId);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, savedItems, toggleSaveItem, isSaved }}>
      {children}
    </AuthContext.Provider>
  );
};
