'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const InnerHeader = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a>
              <Image src="/s.svg" alt="App Logo" width={150} height={50} />
            </a>
          </Link>
        </div>
        <nav className="flex space-x-4">
          <Link href="/" className="text-gray-600 hover:text-indigo-600">
            Home
          </Link>
          <Link href="/music" className="text-gray-600 hover:text-indigo-600">
            Music
          </Link>
          <Link href="/scouts" className="text-gray-600 hover:text-indigo-600">
            Scouts
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-indigo-600">
            Login
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-indigo-600">
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default InnerHeader;
