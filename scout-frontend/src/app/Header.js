'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Toast from './Toast'; // Import the Toast component

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTransparent = pathname === '/' || pathname === '/login';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    }
  }, [pathname]);

  const handleMusicClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIsToastVisible(true);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-10 ${isTransparent ? 'bg-transparent' : 'bg-black'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/s.svg" alt="App Logo" width={150} height={50} />
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
          <nav className={`hidden md:flex md:space-x-4 ${isMenuOpen ? 'hidden' : 'hidden'}`}>
            <Link href="/" className="text-white hover:text-gray-200 font-semibold">
              Home
            </Link>
            <Link href="/music" onClick={handleMusicClick} className="text-white hover:text-gray-200 font-semibold">
              Music
            </Link>
            <Link href="/scouts" className="text-white hover:text-gray-200 font-semibold">
              Scouts
            </Link>
            <Link href="/login" className="text-white hover:text-gray-200 font-semibold">
              Login
            </Link>
            <Link href="/about" className="text-white hover:text-gray-200 font-semibold">
              About Us
            </Link>
          </nav>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-black">
            <Link href="/" className="block text-white text-center py-2 hover:bg-gray-800">Home</Link>
            <Link href="/music" onClick={handleMusicClick} className="block text-white text-center py-2 hover:bg-gray-800">Music</Link>
            <Link href="/scouts" className="block text-white text-center py-2 hover:bg-gray-800">Scouts</Link>
            <Link href="/login" className="block text-white text-center py-2 hover:bg-gray-800">Login</Link>
            <Link href="/about" className="block text-white text-center py-2 hover:bg-gray-800">About Us</Link>
          </nav>
        )}
      </header>
      <Toast
        message="You must be signed in to view this page."
        isVisible={isToastVisible}
        onHide={() => setIsToastVisible(false)}
      />
    </>
  );
};

export default Header;
