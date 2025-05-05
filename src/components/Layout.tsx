import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Book,
  Calendar,
  Home,
  Settings as SettingsIcon,
  Mail,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
  }>({
    isOpen: false,
    mode: 'signin',
  });

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                MindSpan
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`nav-link text-gray-700 hover:text-blue-600 font-medium ${isActive(
                  '/'
                )}`}
              >
                Dashboard
              </Link>
              <Link
                to="/library"
                className={`nav-link text-gray-700 hover:text-blue-600 font-medium ${isActive(
                  '/library'
                )}`}
              >
                Library
              </Link>
              <Link
                to="/daily-review"
                className={`nav-link text-gray-700 hover:text-blue-600 font-medium ${isActive(
                  '/daily-review'
                )}`}
              >
                Daily Review
              </Link>
              <Link
                to="/daily-email"
                className={`nav-link text-gray-700 hover:text-blue-600 font-medium ${isActive(
                  '/daily-email'
                )}`}
              >
                Daily Email
              </Link>
              <Link
                to="/settings"
                className={`nav-link text-gray-700 hover:text-blue-600 font-medium ${isActive(
                  '/settings'
                )}`}
              >
                Settings
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <button
                    onClick={() =>
                      setAuthModal({ isOpen: true, mode: 'signin' })
                    }
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() =>
                      setAuthModal({ isOpen: true, mode: 'signup' })
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-t md:hidden">
        <div className="flex justify-between px-6 py-3">
          <Link to="/" className="flex flex-col items-center text-xs">
            <Home
              className={`h-6 w-6 ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'
              }`}
            />
            <span
              className={
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'
              }
            >
              Home
            </span>
          </Link>
          <Link to="/library" className="flex flex-col items-center text-xs">
            <Book
              className={`h-6 w-6 ${
                location.pathname === '/library'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            />
            <span
              className={
                location.pathname === '/library'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }
            >
              Library
            </span>
          </Link>
          <Link
            to="/daily-review"
            className="flex flex-col items-center text-xs"
          >
            <Calendar
              className={`h-6 w-6 ${
                location.pathname === '/daily-review'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            />
            <span
              className={
                location.pathname === '/daily-review'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }
            >
              Review
            </span>
          </Link>
          <Link
            to="/daily-email"
            className="flex flex-col items-center text-xs"
          >
            <Mail
              className={`h-6 w-6 ${
                location.pathname === '/daily-email'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            />
            <span
              className={
                location.pathname === '/daily-email'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }
            >
              Email
            </span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center text-xs">
            <SettingsIcon
              className={`h-6 w-6 ${
                location.pathname === '/settings'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            />
            <span
              className={
                location.pathname === '/settings'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }
            >
              Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
      />

      {/* Main content */}
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0">
        <div className="page-transition">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
