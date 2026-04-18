import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ResourceCard from '../../components/resource/ResourceCard';
import { getAllResources, searchResources } from '../../services/resourceService';

const BrowseResourcesPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    location: '',
  });
  const [resources, setResources] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await getAllResources();
      const data = response.data || [];
      setResources(data);
      setResults(data);
    } catch (error) {
      console.error('Resource fetch failed', error);
      setResources([]);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.minCapacity) params.minCapacity = Number(filters.minCapacity);
      if (filters.location) params.location = filters.location;

      if (Object.keys(params).length === 0) {
        setResults(resources);
      } else {
        const response = await searchResources(params);
        setResults(response.data || []);
      }
      setSearched(true);
    } catch (error) {
      setResults([]);
      setSearched(true);
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <nav className="bg-[#2464a7] text-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-[1880px] items-center justify-between px-8">
          <div className="text-xl font-semibold tracking-tight sm:text-2xl">Smart Campus</div>
          <div className="flex items-center gap-6 text-sm sm:text-base">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive ? 'font-semibold text-white' : 'text-white/80 hover:text-white'
                }`
              }
            >
              Browse Resources
            </NavLink>
            <NavLink
              to="/admin/resources"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive ? 'font-semibold text-white' : 'text-white/80 hover:text-white'
                }`
              }
            >
              Manage Resources
            </NavLink>
          </div>
        </div>
      </nav>

      <header className="bg-[#c9d6e3] py-14 text-center text-[#0f4985]">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="text-3xl font-medium sm:text-5xl">
            Find &amp; Book Campus Resources
          </h1>
          <p className="mt-2 text-base sm:text-2xl">
            Search labs, lecture halls, meeting rooms and equipment
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1880px] px-8 py-6">
        <form onSubmit={handleSearch} className="rounded-2xl border border-[#9ec3ea] bg-[#f4f7fb] p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="rounded-xl border border-[#9ec3ea] bg-[#c9d6e3] px-4 py-2.5 text-base text-[#0f4985] outline-none sm:text-xl"
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
              value={filters.minCapacity}
              onChange={handleChange}
              placeholder="Min Capacity"
              className="rounded-xl border border-[#9ec3ea] bg-[#c9d6e3] px-4 py-2.5 text-base text-[#0f4985] outline-none sm:text-xl"
            />

            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Location"
              className="rounded-xl border border-[#9ec3ea] bg-[#c9d6e3] px-4 py-2.5 text-base text-[#0f4985] outline-none sm:text-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#2464a7] px-6 py-2.5 text-base font-medium text-white transition hover:bg-[#1d558f] disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <h2 className="mt-5 text-2xl font-semibold text-[#0f3d74] sm:text-3xl">Available Resources</h2>

        {searched && results.length === 0 && (
          <div className="mt-6 rounded-2xl border border-[#9ec3ea] bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F1FB] text-[#2464a7]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>
            <p className="text-xl font-medium text-[#0f3d74] sm:text-2xl">No resources found</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
