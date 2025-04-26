import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { createPortal } from 'react-dom';

export default function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="text-center">
        <ClipLoader color="#36d7b7" size={50} />
        <p className="mt-4 text-white">Preparing your coding environment...</p>
      </div>
    </div>,
    document.body
  );
}