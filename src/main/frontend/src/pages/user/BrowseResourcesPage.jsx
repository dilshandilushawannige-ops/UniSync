import React, { useState } from 'react';
import ResourceCard from '../../components/resource/ResourceCard';
import { searchResources } from '../../services/resourceService';

const BrowseResourcesPage = () => {
  const [searchParams, setSearchParams] = useState({
    type: '',
    minCapacity: '',
    location: '',
  });

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const params = {
        ...(searchParams.type && { type: searchParams.type }),
        ...(searchParams.minCapacity && { minCapacity: parseInt(searchParams.minCapacity) }),
        ...(searchParams.location && { location: searchParams.location }),
      };

      const response = await searchResources(params);
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Error searching resources:', error);
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10.5 12 4l9 6.5" />
                <path d="M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">Smart Campus</span>
          </div>
        </div>
      </nav>

      <header className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white p-8 sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find &amp; Book Campus Resources
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Discover lecture halls, labs, meeting rooms, and equipment across campus using smart filters.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <select
              name="type"
              value={searchParams.type}
              onChange={handleParamChange}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-blue-200 focus:ring"
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">LECTURE_HALL</option>
              <option value="LAB">LAB</option>
              <option value="MEETING_ROOM">MEETING_ROOM</option>
              <option value="EQUIPMENT">EQUIPMENT</option>
            </select>

            <input
              name="minCapacity"
              type="number"
              min="1"
              value={searchParams.minCapacity}
              onChange={handleParamChange}
              placeholder="Min Capacity"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-blue-200 focus:ring"
            />

            <input
              name="location"
              value={searchParams.location}
              onChange={handleParamChange}
              placeholder="Location"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-blue-200 focus:ring"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {searched && results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>
            <p className="text-base font-medium text-slate-700">No resources found</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting the filters and search again.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BrowseResourcesPage;
