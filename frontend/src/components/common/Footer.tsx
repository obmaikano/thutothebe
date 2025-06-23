import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
          <span>© {currentYear} Ministry of Education, Botswana. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-6">
          <a 
            href="/help" 
            className="hover:text-gray-900 transition-colors"
          >
            Help & Support
          </a>
          <a 
            href="/privacy" 
            className="hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            className="hover:text-gray-900 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 