"use client";

import EmailVerification from "@/components/auth/EmailVerification";
import type { StrapiCustomer } from "@/lib/auth-types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: StrapiCustomer) => void;
};

export default function LoginModal({ isOpen, onClose, onSuccess }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-parchment rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-dark transition-colors z-10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <EmailVerification 
            onVerified={(customer) => {
              onSuccess(customer);
            }} 
          />
        </div>
      </div>
    </div>
  );
}
