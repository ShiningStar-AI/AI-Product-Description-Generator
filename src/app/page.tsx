'use client';

import { useState } from 'react';

export default function AIGeneratorPage() {
  // State for the product input, the generated description, loading, and errors
  const [productInput, setProductInput] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setLoading(true);
    setError('');
    setDescription('');

    try {
      // Call our own backend API
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: productInput, targetAudience: targetAudience }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate description.');
      }

      const data = await res.json();
      setDescription(data.description);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen text-white flex justify-center pt-20">
      <div className="w-full max-w-xl p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          AI Product Description Generator 🤖
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
            placeholder="e.g., Wireless Noise-Cancelling Headphones"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 p-3 rounded font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Description'}
          </button>
          <label htmlFor="targetAudience" className="text-sm font-medium text-gray-400 mt-4">Target Audience</label>
<input
  id="targetAudience"
  type="text"
  value={targetAudience}
  onChange={(e) => setTargetAudience(e.target.value)}
  placeholder="e.g., young professionals"
  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
/>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {description && (
          <div className="mt-8 p-4 border border-gray-600 rounded-md bg-gray-700">
            <h2 className="text-xl font-semibold mb-2">Generated Description:</h2>
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
