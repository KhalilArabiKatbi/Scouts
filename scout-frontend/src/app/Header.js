'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-transparent">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/s.svg" alt="App Logo" width={150} height={50} />
        </div>
        <nav className="flex space-x-4">
          <Link href="/music" className="text-white hover:text-gray-200 font-semibold">
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
  );
};

export default Header;
