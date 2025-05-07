'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [content, setContent] = useState<{
    homeheading: string;
    homeimage: string;
    hometext: string;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth', { credentials: 'include' });
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    fetchContent();
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!content) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {isAuthenticated && (
        <header className="fixed top-0 left-0 w-full py-2 px-10 flex justify-between items-center bg-secondary shadow z-50">
          <Link
            href="/admin"
            className="text-sm font-medium hover:text-primary/80 transition duration-300"
          >
            Admin Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-primary hover:bg-primary/80 text-main text-sm font-medium py-1 px-4 rounded-md transition duration-300"
          >
            Log Out
          </button>
        </header>
      )}
      <h1 className="text-4xl font-bold mb-4 mt-20">{content.homeheading}</h1>
      <p className="text-lg mb-6 max-w-xl">{content.hometext}</p>
      {content.homeimage && (
        <img
          src={content.homeimage}
          alt="Home Image"
          className="w-[500px] max-w-full"
        />
      )}
    </div>
  );
}