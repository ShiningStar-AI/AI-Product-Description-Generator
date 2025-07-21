'use client';

import { useState } from 'react';

// Define the structure for the template options
const templates = [
  {
    name: 'E-commerce Product',
    description: 'Optimized for online stores and marketplaces',
    tone: 'professional',
    style: 'persuasive',
  },
  {
    name: 'Luxury Item',
    description: 'Elegant and sophisticated tone for high-end products',
    tone: 'luxury',
    style: 'descriptive',
  },
  {
    name: 'Technical Product',
    description: 'Detailed specifications and features focus',
    tone: 'professional',
    style: 'technical',
  },
];

export default function AIGeneratorPage() {
  type Template = {
  name: string;
  description: string;
  tone: string;
  style: string;
};
  // State for all the form inputs
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [tone, setTone] = useState('professional');
  const [style, setStyle] = useState('persuasive');

  // State for the generated description, loading, and errors
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTemplateClick = (template: Template) => {
    setTone(template.tone);
    setStyle(template.style);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !keyFeatures) {
      setError('Product Name and Key Features are required.');
      return;
    }
    setLoading(true);
    setError('');
    setDescription('');

    try {
      // Call our own backend API
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productName, 
          targetAudience, 
          keyFeatures,
          tone,
          style
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate description.');
      }

      const data = await res.json();
      setDescription(data.description);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen text-white flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">AI Product Description Generator</h1>
          <p className="text-gray-400 mt-2">Create compelling, SEO-optimized product descriptions in seconds using advanced AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Create Product Description</h2>
          
          {/* Templates Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-3">Choose a Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => handleTemplateClick(template)}
                  className={`p-4 border rounded-lg text-left transition ${tone === template.tone && style === template.style ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-purple-600'}`}
                >
                  <p className="font-semibold">{template.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">Fields marked with <span className="text-red-500">*</span> are required</p>

          {/* Input Fields Section */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="productName" className="mb-2 font-medium text-gray-300">Product Name <span className="text-red-500">*</span></label>
              <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product name" required className="p-3 bg-gray-900 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div className="flex flex-col">
              <label htmlFor="targetAudience" className="mb-2 font-medium text-gray-300">Target Audience</label>
              <input id="targetAudience" type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., young professionals" className="p-3 bg-gray-900 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div className="flex flex-col">
              <label htmlFor="keyFeatures" className="mb-2 font-medium text-gray-300">Key Features <span className="text-red-500">*</span></label>
              <textarea id="keyFeatures" value={keyFeatures} onChange={(e) => setKeyFeatures(e.target.value)} placeholder="Enter product features" required rows={4} className="p-3 bg-gray-900 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8">
            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-500">
              {loading ? 'Generating...' : 'Generate Description'}
            </button>
          </div>
        </form>

        {/* Output Section */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {description && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Generated Description:</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
