import React, { useEffect, useMemo, useState } from 'react';
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

  const stats = useMemo(() => {
    const total = resources.length;
    const available = resources.filter((resource) => resource.status === 'ACTIVE').length;
    const outOfService = resources.filter((resource) => resource.status === 'OUT_OF_SERVICE').length;
    return { total, available, outOfService };
  }, [resources]);

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-slate-900">
      <nav className="bg-gradient-to-r from-[#0C447C] to-[#378ADD] text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-lg font-bold tracking-tight">Smart Campus Hub</div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-white text-[#185FA5]' : 'text-white/90 hover:bg-white/20'
                }`
              }
            >
              Browse
            </NavLink>
            <NavLink
              to="/admin/resources"
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-white text-[#185FA5]' : 'text-white/90 hover:bg-white/20'
                }`
              }
            >
              Admin
            </NavLink>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-r from-[#0C447C] to-[#185FA5] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find &amp; Book Campus Resources
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
            Discover lecture halls, labs, meeting rooms, and equipment across campus using smart filters.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-blue-100">Total</p>
              <p className="mt-1 text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-blue-100">Available</p>
              <p className="mt-1 text-2xl font-bold">{stats.available}</p>
            </div>
            <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-blue-100">Out of Service</p>
              <p className="mt-1 text-2xl font-bold">{stats.outOfService}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="rounded-2xl border border-[#d4e6f7] bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="rounded-xl border border-[#c8dcf0] bg-[#E6F1FB] px-3 py-2.5 text-sm outline-none ring-[#8cb8e3] focus:ring"
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
              className="rounded-xl border border-[#c8dcf0] bg-[#E6F1FB] px-3 py-2.5 text-sm outline-none ring-[#8cb8e3] focus:ring"
            />

            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Location"
              className="rounded-xl border border-[#c8dcf0] bg-[#E6F1FB] px-3 py-2.5 text-sm outline-none ring-[#8cb8e3] focus:ring"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-[#0C447C] to-[#378ADD] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {searched && results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#d4e6f7] bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F1FB] text-[#185FA5]">
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
