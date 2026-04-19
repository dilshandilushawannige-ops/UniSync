import { useMemo, useState } from 'react';
import '../../styles/manage-resources-modern.css';

function ManageResourcesModernPage() {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    minCapacity: '',
  });

  const resources = [];

  const summary = useMemo(() => {
    const total = resources.length;
    const available = resources.filter((item) => item.status === 'ACTIVE').length;
    return { total, available };
  }, [resources]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="resource-page">
      <section
        className="resource-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 23, 42, 0.52), rgba(15, 23, 42, 0.62)), url('/assets/bg-campus.png')",
        }}
      >
        <div className="resource-hero-content">
          <h1>Campus Facilities &amp; Assets</h1>
          <p>Browse, filter, and book campus resources in real time</p>

          <div className="stats-grid">
            <article className="stat-glass">
              <div className="stat-icon">🗂️</div>
              <p className="stat-value">{summary.total}</p>
              <p className="stat-label">TOTAL ROOMS</p>
            </article>

            <article className="stat-glass">
              <div className="stat-icon">✓</div>
              <p className="stat-value">{summary.available}</p>
              <p className="stat-label">AVAILABLE</p>
            </article>

            <article className="stat-glass admin">
              <div className="stat-icon">👤</div>
              <p className="stat-value">Admin</p>
              <p className="stat-label">MODE</p>
            </article>
          </div>
        </div>
      </section>

      <section className="resource-main">
        <div className="resource-row">
          <p className="crumb">Facilities / Resources</p>
          <button type="button" className="add-btn">+ Add Resource</button>
        </div>

        <div className="filters-box">
          <h2 className="filters-title">FILTERS</h2>
          <div className="filters-grid">
            <select
              className="filter-input"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>

            <select
              className="filter-input"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>

            <input
              className="filter-input"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search location"
            />

            <input
              className="filter-input"
              type="number"
              min="1"
              name="minCapacity"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              placeholder="Min Capacity"
            />
          </div>
        </div>

        <section className="list-card">
          <h3 className="empty-title">No resources found</h3>
          <p className="empty-copy">Add resources or adjust filters to display results.</p>
        </section>
      </section>
    </div>
  );
}

export default ManageResourcesModernPage;
