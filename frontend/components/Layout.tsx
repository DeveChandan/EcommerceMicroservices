import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>E-Commerce Store</title>
        <meta name="description" content="E-Commerce store built with Next.js and NestJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <p className="text-center">&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;