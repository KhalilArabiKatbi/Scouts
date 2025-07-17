'use client';

import React, { useState, useEffect } from 'react';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    text: 'Embrace the Adventure',
    subtext: 'Discover a world of excitement and challenge.',
  },
  {
    src: 'https://images.unsplash.com/photo-1525179657023-2599fa9eaa22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    text: 'Forge Lifelong Friendships',
    subtext: 'Connect with fellow scouts and create lasting bonds.',
  },
  {
    src: 'https://images.unsplash.com/photo-1517627239332-795a1b4b9a4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
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
          <img
            src={image.src}
            alt={image.text}
            className="w-full h-full object-cover"
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
