'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setSuccess('✅ Login successful!');
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } else {
      const data = await res.json();
      setError(data?.error || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pb-24">
      <form
        onSubmit={handleSubmit}
        className="p-8 border border-primary/20 rounded-2xl shadow-full w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold mb-6 tracking-tight text-center">Admin Login</h1>
        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-sm text-center">{success}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-main border border-primary/30 rounded-md placeholder:text-primary/50 focus:outline-none focus:border-primary/50"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-main border border-primary/30 rounded-md placeholder:text-primary/50 focus:outline-none focus:border-primary/50"
        />
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 text-main font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Log In
        </button>
      </form>
    </div>
  );
}