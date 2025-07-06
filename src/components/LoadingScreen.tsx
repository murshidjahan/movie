// components/LoadingScreen.tsx
"use client";

import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen gap-4"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ height: 40, width: 40, color: "var(--primary)" }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="text-lg font-semibold">Loading...</span>
    </div>
  );
};

export default LoadingScreen;
