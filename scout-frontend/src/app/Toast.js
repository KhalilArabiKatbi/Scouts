'use client';

import React, { useEffect } from 'react';

const Toast = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md shadow-lg">
      {message}
    </div>
  );
};

export default Toast;
