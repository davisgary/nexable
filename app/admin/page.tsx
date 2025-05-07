'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [homeHeading, setHomeHeading] = useState('');
  const [homeText, setHomeText] = useState('');
  const [homeImage, setHomeImage] = useState('');
  const [headingSuccessMessage, setHeadingSuccessMessage] = useState('');
  const [textSuccessMessage, setTextSuccessMessage] = useState('');
  const [imageSuccessMessage, setImageSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndLoad = async () => {
      try {
        const res = await fetch('/api/auth', { credentials: 'include' });
        const data = await res.json();

        if (!data.authenticated) {
          router.push('/');
          return;
        }

        const contentRes = await fetch('/api/content');
        const content = await contentRes.json();

        if (content?.homeheading) setHomeHeading(content.homeheading);
        if (content?.hometext) setHomeText(content.hometext);
        if (content?.homeimage) setHomeImage(content.homeimage);

        setLoading(false);
      } catch (err) {
        console.error('Auth or content fetch failed:', err);
        router.push('/');
      }
    };

    checkAndLoad();
  }, [router]);

  const handleSaveText = async () => {
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: 'homeheading', value: homeHeading }),
      });
      setHeadingSuccessMessage('Home Heading Updated!');
    } catch (error) {
      console.error('Error updating heading:', error);
    }
  };

  const handleSaveHomeText = async () => {
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: 'hometext', value: homeText }),
      });
      setTextSuccessMessage('Home Text Updated!');
    } catch (error) {
      console.error('Error updating home text:', error);
    }
  };

  const handleSaveImage = async (url: string) => {
    setHomeImage(url);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: 'homeimage', value: url }),
      });
      setImageSuccessMessage('Home Image Updated!');
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
      });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) return null;

  return (
    <main>
      <header className="fixed top-0 left-0 w-full py-2 px-10 flex justify-between items-center bg-secondary shadow z-50">
        <Link href="/" className="text-sm font-medium hover:text-primary/80 transition duration-300">
          Visit Site
        </Link>
        <button
          onClick={handleLogout}
          className="bg-primary hover:bg-primary/80 text-main text-sm font-medium py-1 px-4 rounded-md transition duration-300"
        >
          Log Out
        </button>
      </header>
      <div className="pt-8 max-w-xl mx-2 sm:mx-auto p-8 my-16 border border-primary/20 rounded-md shadow-full">
        <h1 className="text-3xl font-semibold mb-8 text-center">Admin Dashboard</h1>
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Edit Home Heading</h2>
          {headingSuccessMessage && (
            <div className="flex items-center gap-2 mb-4 text-green-600 text-sm font-semibold">
              <span>✅</span><span>{headingSuccessMessage}</span>
            </div>
          )}
          <input
            type="text"
            value={homeHeading}
            onChange={(e) => {
              setHomeHeading(e.target.value);
              setHeadingSuccessMessage('');
            }}
            className="w-full px-4 py-2 mb-4 bg-main border border-primary/30 rounded-md focus:outline-none focus:border-primary/50"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveText}
              className="bg-primary hover:bg-primary/80 text-main text-sm font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Save Heading
            </button>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Edit Home Text</h2>
          {textSuccessMessage && (
            <div className="flex items-center gap-2 mb-4 text-green-600 text-sm font-semibold">
              <span>✅</span><span>{textSuccessMessage}</span>
            </div>
          )}
          <textarea
            value={homeText}
            onChange={(e) => {
              setHomeText(e.target.value);
              setTextSuccessMessage('');
            }}
            rows={4}
            className="w-full px-4 py-2 mb-4 bg-main border border-primary/30 rounded-md focus:outline-none focus:border-primary/50"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveHomeText}
              className="bg-primary hover:bg-primary/80 text-main text-sm font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Save Text
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-4">Edit Home Image</h2>
          {imageSuccessMessage && (
            <div className="flex items-center gap-2 mb-4 text-green-600 text-sm font-semibold">
              <span>✅</span><span>{imageSuccessMessage}</span>
            </div>
          )}
          <ImageUpload onUpload={handleSaveImage} />
          {homeImage && (
            <div className="flex justify-center mt-6">
              <img
                src={homeImage}
                alt="Home"
                className="w-72 rounded-md shadow"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}