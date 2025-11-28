import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import routes from './routes';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PasswordProtection from './components/PasswordProtection';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiresPassword?: boolean }> = ({ 
  children, 
  requiresPassword 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!requiresPassword) {
    return <>{children}</>;
  }

  return (
    <PasswordProtection
      isAuthenticated={isAuthenticated}
      onAuthenticated={() => setIsAuthenticated(true)}
    >
      {children}
    </PasswordProtection>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute requiresPassword={route.requiresPassword}>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;