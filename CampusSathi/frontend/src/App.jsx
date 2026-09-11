import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiChatbot from './components/AiChatbot';

import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import CollegeFinder from './pages/CollegeFinder';
import CollegeDetails from './pages/CollegeDetails';
import CourseFinder from './pages/CourseFinder';
import AdmissionGuide from './pages/AdmissionGuide';
import DocumentChecklist from './pages/DocumentChecklist';
import HostelFinder from './pages/HostelFinder';
import HostelPackingList from './pages/HostelPackingList';
import ScholarshipFinder from './pages/ScholarshipFinder';
import StudyHub from './pages/StudyHub';
import AskSenior from './pages/AskSenior';
import Faq from './pages/Faq';
import Notices from './pages/Notices';
import Dashboard from './pages/Dashboard';
import SavedItems from './pages/SavedItems';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/colleges" element={<CollegeFinder />} />
                <Route path="/college/:id" element={<CollegeDetails />} />
                <Route path="/courses" element={<CourseFinder />} />
                <Route path="/admission" element={<AdmissionGuide />} />
                <Route path="/documents" element={<DocumentChecklist />} />
                <Route path="/hostels" element={<HostelFinder />} />
                <Route path="/hostels/packing-list" element={<HostelPackingList />} />
                <Route path="/scholarships" element={<ScholarshipFinder />} />
                <Route path="/study-hub" element={<StudyHub />} />
                <Route path="/ask-senior" element={<AskSenior />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/saved" element={<SavedItems />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <AiChatbot />
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
