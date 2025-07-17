'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  { src: '/hero1.jpg' },
  { src: '/hero2.jpg' },
  { src: '/hero3.jpg' },
];

const DynamicBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt=""
            layout="fill"
            objectFit="cover"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
    </div>
  );
};

export default DynamicBackground;
