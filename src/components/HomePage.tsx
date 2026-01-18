'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleSignInService } from '@/lib/google-signin';
import { MemberSignInService } from '@/lib/member-signin';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const heroImages = [
    'TTS-Header-1-1280x720.jpg',
    'ParaiDance.jpeg',
    'ParaiHeat.jpeg',
    'TTS-Header-2-1280x720.jpg', 
    'TTS-Header-3-1280x720.jpg'
  ];

  const getImagePairs = () => {
    const pairs = [];
    for (let i = 0; i < heroImages.length; i += 2) {
      pairs.push(heroImages.slice(i, i + 2));
    }
    return pairs;
  };

  const imagePairs = getImagePairs();

  useEffect(() => {
    GoogleSignInService.initialize();
    MemberSignInService.initialize();
  }, []);

  useEffect(() => {
    if (!isAutoScrolling) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length, isAutoScrolling]);

  const nextImage = () => {
    setIsAutoScrolling(false);
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setIsAutoScrolling(false);
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleAdminLogin = async () => {
    setIsSigningIn(true);
    try {
      console.log('Starting Google Sign-in...');
      
      if (!window.google?.accounts) {
        console.log('Google accounts not loaded, initializing...');
        await GoogleSignInService.initialize();
      }
      
      await GoogleSignInService.signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign-in failed. Please make sure popups are enabled and try again.');
      setIsSigningIn(false);
    }
  };

  const handleMemberLogin = async () => {
    try {
      await MemberSignInService.signIn();
    } catch (error) {
      console.error('Member sign in failed:', error);
      alert('Sign-in failed. Please try again.');
    }
  };

  const basePath = '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/images/ATPLogo.png" 
                alt="Atlanta Parai Team" 
                className="h-20 w-20 object-contain rounded-full bg-blue-600 p-2"
              />
              <div className="ml-4">
                <h1 className="text-xl md:text-3xl font-bold text-white">Atlanta Parai Team</h1>
                <p className="text-blue-100 text-sm md:text-lg">Preserving Tamil Culture Through Music</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdminLogin}
                disabled={isSigningIn}
                className="bg-red-700 hover:bg-red-800 text-white px-2 md:px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-xs md:text-sm"
              >
                {isSigningIn ? 'Connecting...' : 'Admin Login'}
              </button>
              <button
                onClick={handleMemberLogin}
                className="bg-green-500 bg-opacity-80 hover:bg-opacity-100 text-white px-2 md:px-4 py-2 rounded-lg font-medium transition-colors text-xs md:text-sm"
              >
                Member Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome to Our Musical Journey</h2>
          <p className="text-gray-600 mb-4 text-center max-w-4xl mx-auto">
            The Atlanta Parai Team is dedicated to preserving and promoting the rich musical heritage of Tamil culture. 
            Parai, one of the oldest percussion instruments in Tamil tradition, carries the heartbeat of our ancestors 
            and continues to resonate through generations.
          </p>
          <p className="text-gray-600 mb-6 text-center max-w-4xl mx-auto">
            Our team brings together passionate musicians who celebrate Tamil culture through traditional Parai performances, 
            cultural events, and community gatherings. We believe in keeping our heritage alive while sharing its beauty 
            with the world.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
            <img 
              src={`/images/${heroImages[currentImageIndex]}`} 
              alt="Tamil Culture and Parai Performance" 
              className="w-full h-80 object-cover"
            />
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              ←
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              →
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoScrolling(false);
                    setCurrentImageIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Traditional Instruments</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Melam', image: 'Melam.jpeg' },
              { name: 'Chinna Melam', image: 'Chinna Melam.jpeg' },
              { name: 'Pambai', image: 'Pambai.jpeg' },
              { name: 'Thudumbu', image: 'Thudumbu(Red).jpeg' },
              { name: 'Urumi', image: 'Urumi.jpeg' },
              { name: 'Udukkai', image: 'Udukkai.jpeg' },
              { name: 'Jaalra', image: 'Jaalra.jpeg' },
              { name: 'Sangu', image: 'Sangu-1.jpeg' },
              { name: 'Kombu', image: 'KombuFront-1.jpeg' },
              { name: 'Sivan Kombu', image: 'SivanKombu.jpeg' },
              { name: 'Uruttu Satti', image: 'Uruttu Satti.jpeg' },
              { name: 'Valli Kummi', image: 'ValliKummi-Chaplangattai.jpeg' }
            ].map((instrument, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
                <img 
                  src={`/images/${instrument.image}`} 
                  alt={instrument.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <p className="text-sm font-medium text-gray-700">{instrument.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">The Art of Parai</h3>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Parai is more than just a musical instrument – it's a symbol of Tamil identity and cultural pride. 
                Traditionally made from cow hide stretched over a wooden frame, the Parai produces deep, resonant sounds 
                that can be heard from great distances.
              </p>
              <p className="text-gray-600 mb-4">
                In ancient Tamil society, Parai was used for various purposes: announcing important news, 
                celebrating victories, marking festivals, and accompanying folk dances. The rhythmic patterns 
                and beats tell stories of our ancestors and their way of life.
              </p>
              <p className="text-gray-600">
                Today, we continue this tradition by teaching the younger generation, performing at cultural events, 
                and ensuring that the art of Parai remains vibrant in the Tamil diaspora community.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <img 
                src="/images/Tamil_Culture.jpg" 
                alt="Tamil Culture and Parai Art" 
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}