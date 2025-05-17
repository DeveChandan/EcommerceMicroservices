import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-blue-600 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! We couldn't find the page you were looking for.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <a className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition shadow-md">
              Return to Home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}