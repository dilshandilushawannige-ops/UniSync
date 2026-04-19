import { useEffect, useMemo, useState } from 'react';
import { getAllResources } from '../../services/resourceService';
import '../../styles/browse-resources-modern.css';

function BrowseResourcesModernPage() {
  const [allResources, setAllResources] = useState([]);
  const [visibleResources, setVisibleResources] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    minCapacity: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const response = await getAllResources();
        const data = response?.data || [];
        setAllResources(data);
        setVisibleResources(data);
      } catch (error) {
        setAllResources([]);
        setVisibleResources([]);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
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
              {visibleResources.map((resource) => (
                <article key={resource.id} className="browse-resource-card">
                  <h3>{resource.name}</h3>
                  <p>Type: {resource.type}</p>
                  <p>Status: {resource.status}</p>
                  <p>Location: {resource.location || 'N/A'}</p>
                  <p>Capacity: {resource.capacity ?? '-'}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </div>
  );
}

export default BrowseResourcesModernPage;
