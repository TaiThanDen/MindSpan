import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import DailyReview from './pages/DailyReview';
import DailyEmail from './pages/DailyEmail';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { AuthProvider } from './hooks/useAuth';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/daily-review" element={<DailyReview />} />
            <Route path="/daily-email" element={<DailyEmail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;