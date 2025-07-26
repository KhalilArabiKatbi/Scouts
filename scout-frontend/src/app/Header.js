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

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-10 ${isTransparent ? 'bg-transparent' : 'bg-[rgba(90,25,225,0.84)]'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center w-48">
            <Image src="/s.svg" alt="App Logo" width={150} height={50} />
          </div>
          <nav className="flex space-x-4">

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
