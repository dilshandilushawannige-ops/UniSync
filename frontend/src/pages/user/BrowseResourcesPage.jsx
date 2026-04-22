import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../../components/user/StudentPortalLayout';
import ResourceCard from '../../components/resource/ResourceCard';
import { getAllResources, searchResources } from '../../services/resourceService';

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

const BrowseResourcesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    location: '',
  });
  const [resources, setResources] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await getAllResources(getCurrentUserId());
      const data = normalizeResources(response.data || []);
      setResources((prev) => normalizeResources([...(prev || []), ...data]));
      setResults((prev) => normalizeResources([...(prev || []), ...data]));
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

  const handleViewDetails = (resource) => {
    setSelectedResource(resource);
  };

  const handleBookNow = (resource) => {
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
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Find & Book Campus Resources</h1>
          <p style={styles.headerSubtitle}>
            Search labs, lecture halls, meeting rooms and equipment
          </p>
        </div>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchGrid}>
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>

            <input
              name="minCapacity"
              type="number"
              min="1"
              value={filters.minCapacity}
              onChange={handleChange}
              placeholder="Min Capacity"
              style={styles.input}
            />

            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Location"
              style={styles.input}
            />

            <button
              type="submit"
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <h2 style={styles.sectionTitle}>Available Resources</h2>

        {searched && results.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <p style={styles.emptyText}>No resources found</p>
          </div>
        )}

        {results.length > 0 && (
          <div style={styles.resourceGrid}>
            {results.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onViewDetails={handleViewDetails}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </div>

      {selectedResource && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{selectedResource.name}</h3>
              <button
                type="button"
                style={styles.closeButton}
                onClick={() => setSelectedResource(null)}
              >
                Close
              </button>
            </div>
            <div style={styles.modalBody}>
              <p><strong>Type:</strong> {selectedResource.type}</p>
              <p><strong>Capacity:</strong> {selectedResource.capacity ?? '-'}</p>
              <p><strong>Location:</strong> {selectedResource.location || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedResource.status}</p>
              <p><strong>Description:</strong> {selectedResource.description || 'N/A'}</p>
            </div>
            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.bookButton}
                onClick={() => handleBookNow(selectedResource)}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentPortalLayout>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '32px',
    color: 'white',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 12px',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: '1rem',
    margin: 0,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchForm: {
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    padding: '20px',
    marginBottom: '24px',
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#1e293b',
    outline: 'none',
  },
  searchButton: {
    borderRadius: '12px',
    background: '#2563eb',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '16px',
    marginTop: 0,
  },
  emptyState: {
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    background: 'white',
    padding: '48px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#64748b',
    margin: 0,
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '16px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '16px',
    background: 'white',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  closeButton: {
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '14px',
    color: '#64748b',
    background: 'transparent',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
  },
  modalBody: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.8',
  },
  modalFooter: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  bookButton: {
    borderRadius: '8px',
    background: '#1e3a8a',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default BrowseResourcesPage;
