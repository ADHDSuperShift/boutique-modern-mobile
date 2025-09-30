'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log('🔧 Modal opened - setting body overflow hidden');
    } else {
      document.body.style.overflow = 'unset';
      console.log('🔧 Modal closed - resetting body overflow');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  console.log('🔧 Modal render - isOpen:', isOpen);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black bg-opacity-75 overflow-y-auto"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        overflowY: 'auto'
      }}
    >
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div 
          className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-auto"
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            maxWidth: '42rem',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 10,
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
