'use client';

export default function Footer() {
  const basePath = '';

  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/images/ATPLogo.png" 
              alt="Atlanta Parai Team" 
              className="h-12 w-12 object-contain mr-3 rounded-full bg-gray-600 p-1"
            />
            <div>
              <h3 className="text-lg font-bold">Atlanta Parai Team</h3>
              <p className="text-gray-300 text-sm">Preserving Tamil Culture Through Music</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="mailto:contact@atlantaparaiteam.com" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <span className="mr-2">📧</span>
              Contact Us
            </a>
            <a 
              href="https://www.instagram.com/atlantaparaiteam/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <span className="mr-2">📷</span>
              Instagram
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400 text-sm">
          © 2024 Atlanta Parai Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
}