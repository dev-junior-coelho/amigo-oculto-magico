import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import routes from '../../routes';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigation = routes.filter(route => route.visible !== false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://miaoda-site-img.cdn.bcebos.com/placeholder/code_logo_default.png"
                alt="KDD China 2025"
              />
              <span className="ml-2 text-xl font-bold text-white">KDD China 2025 抽奖系统</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-base font-medium rounded-md transition duration-300 ${
                  location.pathname === item.path
                    ? 'text-blue-200 bg-blue-700'
                    : 'text-white hover:text-blue-200 hover:bg-blue-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition duration-300 ${
                    location.pathname === item.path
                      ? 'text-blue-200 bg-blue-700'
                      : 'text-white hover:text-blue-200 hover:bg-blue-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;