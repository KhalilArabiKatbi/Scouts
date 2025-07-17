'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  {
    src: '/hero-1.jpg',
    text: 'Embrace the Adventure',
    subtext: 'Discover a world of excitement and challenge.',
  },
  {
    src: '/hero-2.jpg',
    text: 'Forge Lifelong Friendships',
    subtext: 'Connect with fellow scouts and create lasting bonds.',
  },
  {
    src: '/hero-3.jpg',
    text: 'Learn and Grow',
    subtext: 'Acquire new skills and unlock your full potential.',
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.text}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-white text-5xl md:text-6xl font-extrabold leading-tight">
              {image.text}
            </h2>
            <p className="text-white text-lg md:text-xl mt-4">
              {image.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
