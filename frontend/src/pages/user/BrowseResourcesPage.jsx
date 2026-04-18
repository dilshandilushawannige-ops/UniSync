import React, { useEffect, useState } from 'react';
import ResourceForm from '../../components/resource/ResourceForm';
import resourceService from '../../services/resourceService';

const BrowseResourcesPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    minCapacity: '',
  });
  const [allResources, setAllResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [viewingResource, setViewingResource] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 2600);
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await resourceService.getAllResources();
      const data = response.data || [];
      setAllResources(data);
      setFilteredResources(data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setAllResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const resources = allResources;
  const totalRooms = resources.length;
  const availableRooms = resources.filter((resource) => resource.status === 'ACTIVE').length;

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();

    let next = [...allResources];

    if (filters.type) {
      next = next.filter((resource) => resource.type === filters.type);
    }

    if (filters.status) {
      next = next.filter((resource) => resource.status === filters.status);
    }

    if (filters.location.trim()) {
      const locationText = filters.location.trim().toLowerCase();
      next = next.filter((resource) =>
        (resource.location || '').toLowerCase().includes(locationText)
      );
    }

    if (filters.minCapacity) {
      const minCapacityValue = Number(filters.minCapacity);
      next = next.filter((resource) => Number(resource.capacity || 0) >= minCapacityValue);
    }

    setFilteredResources(next);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      location: '',
      minCapacity: '',
    });
    setFilteredResources(allResources);
  };

  const handleCreateResource = async (data) => {
    try {
      await resourceService.createResource(data);
      await loadResources();
      setIsAddResourceOpen(false);
      showMessage('success', 'Resource created successfully');
    } catch (error) {
      console.error('Failed to create resource:', error);
    }
  };

  const handleOpenEdit = (resource) => {
    setEditingResource(resource);
    setIsAddResourceOpen(true);
  };

  const handleUpdateResource = async (data) => {
    if (!editingResource?.id) {
      return;
    }

    try {
      await resourceService.updateResource(editingResource.id, data);
      await loadResources();
      setIsAddResourceOpen(false);
      setEditingResource(null);
      showMessage('success', 'Resource updated successfully');
    } catch (error) {
      console.error('Failed to update resource:', error);
    }
  };

  const handleDeleteResource = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this resource?');
    if (!confirmed) {
      return;
    }

    try {
      await resourceService.deleteResource(id);
      await loadResources();
      showMessage('success', 'Resource deleted successfully');
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const handleActivateResource = async () => {
    if (!viewingResource?.id) {
      return;
    }

    try {
      await resourceService.updateResourceStatus(viewingResource.id, 'ACTIVE');
      await loadResources();
      setViewingResource(null);
      showMessage('success', 'Resource activated successfully');
    } catch (error) {
      console.error('Failed to activate resource:', error);
    }
  };

  const getTopBorderClass = (type) => {
    if (type === 'LAB') return 'border-t-green-500';
    if (type === 'LECTURE_HALL') return 'border-t-blue-500';
    if (type === 'MEETING_ROOM') return 'border-t-purple-500';
    if (type === 'EQUIPMENT') return 'border-t-orange-500';
    return 'border-t-slate-400';
  };

  const getTypeBadgeClass = (type) => {
    if (type === 'LAB') return 'bg-green-100 text-green-700';
    if (type === 'LECTURE_HALL') return 'bg-blue-100 text-blue-700';
    if (type === 'MEETING_ROOM') return 'bg-purple-100 text-purple-700';
    if (type === 'EQUIPMENT') return 'bg-orange-100 text-orange-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div
        className="relative w-full px-8 py-20 text-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-900 opacity-70"></div>
        <div className="relative z-10">
          <h1 className="mb-4 text-5xl font-bold text-white">Campus Facilities &amp; Assets</h1>
          <p className="text-lg text-slate-300">Browse, filter, and book campus resources in real time</p>
        </div>

        <div className="relative z-10 mx-auto mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-2xl">
          <div className="rounded-xl border border-white/25 bg-white/15 p-4 backdrop-blur-md">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
              </svg>
            </div>
            <p className="text-3xl font-semibold">{totalRooms}</p>
            <p className="mt-1 text-xs font-medium tracking-wider text-slate-200">TOTAL ROOMS</p>
          </div>

          <div className="rounded-xl border border-white/25 bg-white/15 p-4 backdrop-blur-md">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m5 12 5 5L20 7" />
              </svg>
            </div>
            <p className="text-3xl font-semibold">{availableRooms}</p>
            <p className="mt-1 text-xs font-medium tracking-wider text-slate-200">AVAILABLE</p>
          </div>

          <div className="rounded-xl border border-amber-300/35 bg-amber-400/10 p-4 backdrop-blur-md">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300/20 text-amber-300">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20a6 6 0 0 1 12 0" />
              </svg>
            </div>
            <p className="text-3xl font-semibold text-amber-300">Admin</p>
            <p className="mt-1 text-xs font-medium tracking-wider text-amber-200">MODE</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-5 text-sm text-slate-600 sm:px-6 lg:px-8">
        <span>Facilities / Resources</span>
        <button
          type="button"
          onClick={() => {
            setEditingResource(null);
            setIsAddResourceOpen(true);
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          + Add Resource
        </button>
      </div>

      {message.text ? (
        <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {message.text}
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <form onSubmit={applyFilters} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-slate-500">FILTERS</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">LECTURE_HALL</option>
              <option value="LAB">LAB</option>
              <option value="MEETING_ROOM">MEETING_ROOM</option>
              <option value="EQUIPMENT">EQUIPMENT</option>
            </select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
            </select>

            <input
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search location"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />

            <input
              name="minCapacity"
              type="number"
              min="1"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              placeholder="Min Capacity"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
            >
              APPLY
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              CLEAR
            </button>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            Loading resources...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            No resources found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredResources.map((resource) => {
              const isActive = resource.status === 'ACTIVE';

              return (
                <article
                  key={resource.id}
                  className={`rounded-xl border border-slate-200 border-t-4 bg-white p-4 shadow-sm ${getTopBorderClass(resource.type)}`}
                >
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeBadgeClass(resource.type)}`}>
                      {resource.type}
                    </span>

                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {isActive ? 'Active' : 'Out of Service'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{resource.name}</h3>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                      Capacity: {resource.capacity}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-6-5.2-6-11a6 6 0 1 1 12 0c0 5.8-6 11-6 11Z" />
                        <circle cx="12" cy="10" r="2" />
                      </svg>
                      {resource.location}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingResource(resource)}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </button>
                    <button className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
                      Book Now
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(resource)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50"
                      aria-label="Delete resource"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {isAddResourceOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 py-8">
          <div className="my-auto mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="px-8 pt-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-slate-900 text-center">{editingResource ? 'Edit Resource' : 'Add Resource'}</h2>
              <p className="text-sm text-gray-500 mt-1 text-center">{editingResource ? 'Update existing campus resource entry' : 'Create a new campus resource entry'}</p>
            </div>

            <div className="px-6 py-6">
              <ResourceForm
                initialData={editingResource || undefined}
                onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
                onCancel={() => {
                  setIsAddResourceOpen(false);
                  setEditingResource(null);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {viewingResource ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 py-8">
          <div className="my-auto mx-4 w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Resource Details</h2>
            </div>

            <div className="space-y-3 px-6 py-5 text-sm text-slate-700">
              <p><span className="font-semibold">Name:</span> {viewingResource.name}</p>
              <p><span className="font-semibold">Type:</span> {viewingResource.type}</p>
              <p><span className="font-semibold">Status:</span> {viewingResource.status}</p>
              <p><span className="font-semibold">Location:</span> {viewingResource.location}</p>
              <p><span className="font-semibold">Capacity:</span> {viewingResource.capacity}</p>
              {viewingResource.availabilityWindows ? (
                <p><span className="font-semibold">Availability:</span> {viewingResource.availabilityWindows}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setViewingResource(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleActivateResource}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                ACTIVATE
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BrowseResourcesPage;
