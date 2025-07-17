'use client';

import React, { useEffect, useState } from 'react';

const Toast = ({ message, isVisible, onHide }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        // Wait for the fade-out animation to complete before hiding the component
        setTimeout(onHide, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <div
      className={`fixed bottom-5 right-5 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md shadow-lg transition-transform duration-500 ease-in-out ${
        isShowing ? 'transform translate-x-0' : 'transform translate-x-full'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
