import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-300">
            @{currentYear} KDD China 2025 抽奖系统
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;