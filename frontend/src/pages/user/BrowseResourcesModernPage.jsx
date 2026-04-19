import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResources } from '../../services/resourceService';
import '../../styles/browse-resources-modern.css';

const getCurrentUserId = () => {
  const rawUserId = localStorage.getItem('userId');
  if (!rawUserId) return null;

  const parsedUserId = Number(rawUserId);
  return Number.isNaN(parsedUserId) ? null : parsedUserId;
};

const normalizeResources = (resources) => {
  const resourceMap = new Map();
  resources.forEach((item) => {
    if (item?.id != null) {
      resourceMap.set(item.id, item);
    }
  });

  return Array.from(resourceMap.values()).sort((a, b) => Number(b.id) - Number(a.id));
};

const toDisplayType = (value) => {
  if (!value) return 'N/A';
  return String(value)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getStatusStyles = (status) => {
  if (status === 'ACTIVE') {
    return {
      pill: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Active',
    };
  }

  return {
    pill: 'bg-rose-100 text-rose-700 border border-rose-200',
    dot: 'bg-rose-500',
    label: 'Out of Service',
  };
};

function BrowseResourcesModernPage() {
  const navigate = useNavigate();
  const [allResources, setAllResources] = useState([]);
  const [visibleResources, setVisibleResources] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    minCapacity: '',
  });
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const response = await getAllResources(getCurrentUserId());
        const data = normalizeResources(response?.data || []);
        setAllResources((prev) => normalizeResources([...(prev || []), ...data]));
        setVisibleResources((prev) => normalizeResources([...(prev || []), ...data]));
      } catch (error) {
        setAllResources([]);
        setVisibleResources([]);
      } finally {
        setLoading(false);
      }
    };

    loadResources();

    const intervalId = window.setInterval(loadResources, 7000);
    const handleWindowFocus = () => {
      loadResources();
    };
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const summary = useMemo(() => {
    const total = allResources.length;
    const available = allResources.filter((item) => item.status === 'ACTIVE').length;
    return { total, available };
  }, [allResources]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = allResources.filter((resource) => {
      const typeOk = !filters.type || resource.type === filters.type;
      const statusOk = !filters.status || resource.status === filters.status;
      const locationOk =
        !filters.location ||
        (resource.location || '').toLowerCase().includes(filters.location.toLowerCase());
      const capacityOk =
        !filters.minCapacity ||
        Number(resource.capacity || 0) >= Number(filters.minCapacity);

      return typeOk && statusOk && locationOk && capacityOk;
    });
    setVisibleResources(filtered);
  };

  const clearFilters = () => {
    const cleared = { type: '', status: '', location: '', minCapacity: '' };
    setFilters(cleared);
    setVisibleResources(allResources);
  };

  const handleViewDetails = (resource) => {
    setSelectedResource(resource);
  };

  const handleBookNow = (resource) => {
    navigate('/dashboard', {
      state: {
        resourceId: resource.id,
        resourceName: resource.name,
        resourceType: resource.type,
      },
    });
  };

  return (
    <div className="browse-page">
      <section
        className="browse-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 23, 42, 0.56), rgba(15, 23, 42, 0.68)), url('/assets/bg-campus.png')",
        }}
      >
        <div className="browse-hero-content">
          <h1>Campus Facilities &amp; Assets</h1>
          <p>Browse, filter, and book campus resources in real time</p>

          <div className="browse-stats-grid">
            <article className="browse-stat-glass">
              <div className="browse-stat-icon">🗂️</div>
              <p className="browse-stat-value">{summary.total}</p>
              <p className="browse-stat-label">TOTAL ROOMS</p>
            </article>

            <article className="browse-stat-glass">
              <div className="browse-stat-icon">✓</div>
              <p className="browse-stat-value">{summary.available}</p>
              <p className="browse-stat-label">AVAILABLE</p>
            </article>

            <article className="browse-stat-glass browse-admin-card">
              <div className="browse-stat-icon">👤</div>
              <p className="browse-stat-value">Admin</p>
              <p className="browse-stat-label">MODE</p>
            </article>
          </div>
        </div>
      </section>

      <section className="browse-main">
        <p className="browse-crumb">Facilities / Resources</p>

        <div className="browse-filters-box">
          <h2 className="browse-filters-title">FILTERS</h2>
          <div className="browse-filters-grid">
            <select className="browse-filter-input" name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>

            <select className="browse-filter-input" name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>

            <input
              className="browse-filter-input"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search location"
            />

            <input
              className="browse-filter-input"
              type="number"
              min="1"
              name="minCapacity"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              placeholder="Min Capacity"
            />
          </div>

          <div className="browse-filter-actions">
            <button type="button" className="browse-apply-btn" onClick={applyFilters}>APPLY</button>
            <button type="button" className="browse-clear-btn" onClick={clearFilters}>CLEAR</button>
          </div>
        </div>

        <section className="browse-list-card">
          {loading ? <p className="browse-empty-copy">Loading resources...</p> : null}

          {!loading && visibleResources.length === 0 ? (
            <>
              <h3 className="browse-empty-title">No resources found</h3>
              <p className="browse-empty-copy">Try adjusting filters or add resources from admin panel.</p>
            </>
          ) : null}

          {!loading && visibleResources.length > 0 ? (
            <div className="browse-results-grid">
              {visibleResources.map((resource) => {
                const statusStyles = getStatusStyles(resource.status);
                const statusBorderClass = resource.status === 'ACTIVE' ? 'border-t-emerald-400' : 'border-t-rose-400';
                return (
                <article key={resource.id} className={`browse-resource-card border-t-[3px] ${statusBorderClass}`}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {toDisplayType(resource.type)}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles.pill}`}>
                      <span className={`h-2 w-2 rounded-full ${statusStyles.dot}`} />
                      {statusStyles.label}
                    </span>
                  </div>

                  <h3 className="mb-1">{resource.name}</h3>
                  <p>Capacity: {resource.capacity ?? '-'}</p>
                  <p>Location: {resource.location || 'N/A'}</p>
                  <p>Availability: {resource.availabilityWindows || 'N/A'}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => handleViewDetails(resource)}
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#123a66] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0f3154]"
                      onClick={() => handleBookNow(resource)}
                    >
                      Booking Now
                    </button>
                  </div>
                </article>
              )})}
            </div>
          ) : null}
        </section>
      </section>

      {selectedResource ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#0f3d74]">{selectedResource.name}</h3>
                <p className="mt-1 text-sm text-slate-500">Resource Details</p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                onClick={() => setSelectedResource(null)}
              >
                Close
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {toDisplayType(selectedResource.type)}
              </span>
              {(() => {
                const statusStyles = getStatusStyles(selectedResource.status);
                return (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles.pill}`}>
                    <span className={`h-2 w-2 rounded-full ${statusStyles.dot}`} />
                    {statusStyles.label}
                  </span>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p><strong>ID:</strong> {selectedResource.id ?? 'N/A'}</p>
              <p><strong>Capacity:</strong> {selectedResource.capacity ?? 'N/A'}</p>
              <p><strong>Location:</strong> {selectedResource.location || 'N/A'}</p>
              <p><strong>Availability:</strong> {selectedResource.availabilityWindows || 'N/A'}</p>
              <p><strong>Visible To:</strong> {selectedResource.visibleTo || 'N/A'}</p>
              <p><strong>Assigned Users:</strong> {selectedResource.assignedUsers || 'N/A'}</p>
              <p><strong>Created:</strong> {selectedResource.createdAt ? new Date(selectedResource.createdAt).toLocaleString() : 'N/A'}</p>
              <p><strong>Updated:</strong> {selectedResource.updatedAt ? new Date(selectedResource.updatedAt).toLocaleString() : 'N/A'}</p>
            </div>

            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-800">Description</p>
              <p className="mt-1">{selectedResource.description || 'N/A'}</p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="rounded-lg bg-[#123a66] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f3154]"
                onClick={() => handleBookNow(selectedResource)}
              >
                Booking Now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BrowseResourcesModernPage;
