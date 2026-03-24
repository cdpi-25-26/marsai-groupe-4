import { useState, useEffect } from 'react';
import axios from '../../api/config';
import { Button } from "@/components/ui/button";

function Cms() {
  const [enTranslations, setEnTranslations] = useState({});
  const [frTranslations, setFrTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');
  const [pages, setPages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const [enResponse, frResponse] = await Promise.all([
        axios.get('/translations/en'),
        axios.get('/translations/fr')
      ]);
      
      setEnTranslations(enResponse.data);
      setFrTranslations(frResponse.data);
      
      const pageKeys = Object.keys(enResponse.data);
      setPages(pageKeys);
      
      if (pageKeys.length > 0 && !selectedPage) {
        setSelectedPage(pageKeys[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setLoading(false);
    }
  };

  const handleEnChange = (page, key, value) => {
    setEnTranslations(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [key]: value
      }
    }));
  };

  const handleFrChange = (page, key, value) => {
    setFrTranslations(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [key]: value
      }
    }));
  };

  const saveTranslations = async () => {
    try {
      setSaving(true);
      setSuccessMessage('');
      
      await Promise.all([
        axios.put('/translations/en/bulk', { translations: enTranslations }),
        axios.put('/translations/fr/bulk', { translations: frTranslations })
      ]);
      
      setSuccessMessage('Translations saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSaving(false);
    } catch (error) {
      console.error('Error saving translations:', error);
      alert('Error saving translations');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading translations...</div>
      </section>
    );
  }

  const currentPageData = selectedPage ? 
    Object.keys(enTranslations[selectedPage] || {}) : [];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-background rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-300 uppercase font-bold tracking-[2px]">Translation CMS</h2>
          <Button 
            onClick={saveTranslations}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label htmlFor="page-select" className="font-semibold text-gray-700">
            Select Page:
          </label>
          <select 
            id="page-select"
            value={selectedPage} 
            onChange={(e) => setSelectedPage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pages.map(page => (
              <option key={page} value={page}>
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-background rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-[200px_1fr_1fr] gap-4 p-4 bg-white/5 text-white font-semibold border border-white/10">
          <div className='flex text-[var(--table-head)] tracking-[1.7px] h-10 py-2  text-[20px] align-middle uppercase font-bold whitespace-nowrap gap-2'>Key</div>
          <div className="flex text-[var(--table-head)] tracking-[1.7px] h-10 py-2  text-[20px] align-middle uppercase font-bold whitespace-nowrap gap-2">
            
            <span>English</span>
          </div>
          <div className="flex text-[var(--table-head)] tracking-[1.7px] h-10 py-2  text-[20px] align-middle uppercase font-bold whitespace-nowrap gap-2">
            
            <span>French</span>
          </div>
        </div>

        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
          {currentPageData.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No translations found for this page
            </div>
          ) : (
            currentPageData.map(key => (
              <div 
                key={key} 
                className="grid grid-cols-[200px_1fr_1fr] gap-4 p-4 border-b border-gray-200 hover:bg-zinc-500/10"
              >
                <div className="flex items-center">
                  <code className="px-3 py-1 bg-[var(--table-producer)] text-[var(--table-producer-text)] rounded-full text-sm font-medium">
                    {key}
                  </code>
                </div>
                <div>
                  <textarea
  value={enTranslations[selectedPage]?.[key] || ''}
  onChange={(e) => handleEnChange(selectedPage, key, e.target.value)}
  className="w-full px-3 py-2 border border-zinc-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical min-h-15 text-gray-900 dark:text-gray-100"
  rows={2}
/>
                </div>
                <div>
                  <textarea
  value={frTranslations[selectedPage]?.[key] || ''}
  onChange={(e) => handleFrChange(selectedPage, key, e.target.value)}
  className="w-full px-3 py-2 border border-zinc-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical min-h-15 text-gray-900 dark:text-gray-100"
  rows={2}
/>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button 
          onClick={saveTranslations}
          disabled={saving}
          className="min-w-75"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </section>
  );
}

export default Cms;
