import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../../components/user/StudentPortalLayout';
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
      pill: 'browse-status-active',
      dot: 'browse-status-dot-active',
      label: 'Active',
    };
  }

  return {
    pill: 'browse-status-inactive',
    dot: 'browse-status-dot-inactive',
    label: 'Out of Service',
  };
};

const formatTimeDisplay = (value) => {
  if (!value) return '';

  const trimmed = String(value).trim();
  const twelveHourMatch = trimmed.match(/^(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    const hour = Number(twelveHourMatch[1]);
    const minute = twelveHourMatch[2];
    const period = twelveHourMatch[3].toUpperCase();
    if (!Number.isNaN(hour)) {
      return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
    }
  }

  const twentyFourHourMatch = trimmed.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = twentyFourHourMatch[2];
    if (!Number.isNaN(hour)) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = String(hour % 12 || 12).padStart(2, '0');
      return `${displayHour}:${minute} ${period}`;
    }
  }

  return trimmed;
};

const formatAvailability = (resource) => {
  const startTime = formatTimeDisplay(resource?.availableFrom);
  const endTime = formatTimeDisplay(resource?.availableTo);

  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }

  if (startTime) {
    return `${startTime} - N/A`;
  }

  if (endTime) {
    return `N/A - ${endTime}`;
  }

  return resource?.availabilityWindows || 'N/A';
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
    const outOfResource = allResources.filter((item) => item.status !== 'ACTIVE').length;
    return { total, available, outOfResource };
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
    if (resource?.status !== 'ACTIVE') {
      return;
    }

    navigate('/resource-booking', {
      state: {
        resourceId: resource.id,
        resourceName: resource.name,
        resourceType: resource.type,
      },
    });
  };

  return (
    <StudentPortalLayout title="Browse Resources">
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

              <article className="browse-stat-glass browse-out-resource-card">
                <div className="browse-stat-icon">📦</div>
                <p className="browse-stat-value">{summary.outOfResource}</p>
                <p className="browse-stat-label">OUT OF RESOURCE</p>
              </article>

              <article className="browse-stat-glass browse-admin-card">
                <div className="browse-stat-icon">👤</div>
                <p className="browse-stat-value">Student</p>
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
                  const statusBorderClass =
                    resource.status === 'ACTIVE'
                      ? 'browse-resource-card-active'
                      : 'browse-resource-card-inactive';
                  const isBookable = resource.status === 'ACTIVE';
                  return (
                    <article key={resource.id} className={`browse-resource-card ${statusBorderClass}`}>
                      <div className="browse-resource-top">
                        <span className="browse-type-pill">{toDisplayType(resource.type)}</span>
                        <span className={`browse-status-pill ${statusStyles.pill}`}>
                          <span className={`browse-status-dot ${statusStyles.dot}`} />
                          {statusStyles.label}
                        </span>
                      </div>

                      <h3>{resource.name}</h3>
                      <p>Capacity: {resource.capacity ?? '-'}</p>
                      <p>Location: {resource.location || 'N/A'}</p>
                      <p>Availability: {formatAvailability(resource)}</p>

                      <div className="browse-resource-actions">
                        <button
                          type="button"
                          className="browse-details-btn"
                          onClick={() => handleViewDetails(resource)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          disabled={!isBookable}
                          className={`browse-booking-btn ${isBookable ? '' : 'browse-booking-btn-disabled'}`}
                          onClick={() => handleBookNow(resource)}
                        >
                          Booking Now
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </section>
        </section>

        {selectedResource ? (
          <div className="browse-modal-overlay">
            <div className="browse-modal">
              <div className="browse-modal-head">
                <div>
                  <h3 className="browse-modal-title">{selectedResource.name}</h3>
                  <p className="browse-modal-subtitle">Resource Details</p>
                </div>
                <button
                  type="button"
                  className="browse-modal-close"
                  onClick={() => setSelectedResource(null)}
                >
                  Close
                </button>
              </div>

              <div className="browse-modal-badges">
                <span className="browse-type-pill">
                  {toDisplayType(selectedResource.type)}
                </span>
                {(() => {
                  const statusStyles = getStatusStyles(selectedResource.status);
                  return (
                    <span className={`browse-status-pill ${statusStyles.pill}`}>
                      <span className={`browse-status-dot ${statusStyles.dot}`} />
                      {statusStyles.label}
                    </span>
                  );
                })()}
              </div>

              <div className="browse-modal-grid">
                <p><strong>ID:</strong> {selectedResource.id ?? 'N/A'}</p>
                <p><strong>Capacity:</strong> {selectedResource.capacity ?? 'N/A'}</p>
                <p><strong>Location:</strong> {selectedResource.location || 'N/A'}</p>
                <p><strong>Availability:</strong> {formatAvailability(selectedResource)}</p>
                <p><strong>Visible To:</strong> {selectedResource.visibleTo || 'N/A'}</p>
                <p><strong>Assigned Users:</strong> {selectedResource.assignedUsers || 'N/A'}</p>
                <p><strong>Created:</strong> {selectedResource.createdAt ? new Date(selectedResource.createdAt).toLocaleString() : 'N/A'}</p>
                <p><strong>Updated:</strong> {selectedResource.updatedAt ? new Date(selectedResource.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>

              <div className="browse-modal-description">
                <p className="browse-modal-description-title">Description</p>
                <p>{selectedResource.description || 'N/A'}</p>
              </div>

              <div className="browse-modal-actions">
                <button
                  type="button"
                  disabled={selectedResource.status !== 'ACTIVE'}
                  className={`browse-booking-btn ${
                    selectedResource.status === 'ACTIVE' ? '' : 'browse-booking-btn-disabled'
                  }`}
                  onClick={() => handleBookNow(selectedResource)}
                >
                  Booking Now
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentPortalLayout>
  );
}

export default BrowseResourcesModernPage;
