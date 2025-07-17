'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import SignInModal from './SignInModal';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    }
  }, [pathname]);

  const handleMusicClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isTransparent = pathname === '/' || pathname === '/login';

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-10 ${isTransparent ? 'bg-transparent' : 'bg-black'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
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
      <SignInModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Header;
