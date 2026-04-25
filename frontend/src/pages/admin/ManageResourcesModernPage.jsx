import { useEffect, useMemo, useState } from 'react';
import AdminPortalLayout from '../../components/admin/AdminPortalLayout';
import ResourceForm from '../../components/resource/ResourceForm';
import { createResource, deleteResource, getAllResources, updateResource } from '../../services/resourceService';
import '../../styles/manage-resources-modern.css';

function ManageResourcesModernPage() {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    minCapacity: '',
  });
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadResources = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const response = await getAllResources();
      setResources(response?.data || []);
    } catch (error) {
      setLoadError(error?.response?.data?.message || 'Failed to load resources.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const summary = useMemo(() => {
    const total = resources.length;
    const available = resources.filter((item) => item.status === 'ACTIVE').length;
    const outOfService = resources.filter((item) => item.status === 'OUT_OF_SERVICE').length;
    return { total, available, outOfService };
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const typeOk = !filters.type || resource.type === filters.type;
      const statusOk = !filters.status || resource.status === filters.status;
      const locationOk =
        !filters.location ||
        String(resource.location || '').toLowerCase().includes(filters.location.toLowerCase());
      const capacityOk =
        !filters.minCapacity || Number(resource.capacity || 0) >= Number(filters.minCapacity);

      return typeOk && statusOk && locationOk && capacityOk;
    });
  }, [resources, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingResource(null);
    setSaveError('');
    setIsResourceModalOpen(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setSaveError('');
    setIsResourceModalOpen(true);
  };

  const closeResourceModal = () => {
    if (isSaving) return;
    setIsResourceModalOpen(false);
    setEditingResource(null);
    setSaveError('');
  };

  const handleSaveResource = async (formData) => {
    setIsSaving(true);
    setSaveError('');
    try {
      if (editingResource?.id) {
        await updateResource(editingResource.id, formData);
      } else {
        await createResource(formData);
      }
      setIsResourceModalOpen(false);
      setEditingResource(null);
      await loadResources();
    } catch (error) {
      setSaveError(error?.response?.data?.message || 'Failed to save resource. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    const confirmed = window.confirm('Are you sure you want to delete this resource?');
    if (!confirmed) return;

    try {
      await deleteResource(resourceId);
      await loadResources();
    } catch (error) {
      setLoadError(error?.response?.data?.message || 'Failed to delete resource.');
    }
  };

  return (
    <AdminPortalLayout title="Manage Resources">
      <div className="resource-page">
      <section
        className="resource-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.62)), url('/assets/bg-campus.png')",
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
          <button type="button" className="add-btn" onClick={openCreateModal}>+ Add Resource</button>
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
          {isLoading ? (
            <p className="empty-copy">Loading resources...</p>
          ) : null}

          {!isLoading && loadError ? (
            <p className="empty-copy" style={{ color: '#b91c1c' }}>{loadError}</p>
          ) : null}

          {!isLoading && !loadError && filteredResources.length === 0 ? (
            <>
              <h3 className="empty-title">No resources found</h3>
              <p className="empty-copy">Add resources or adjust filters to display results.</p>
            </>
          ) : null}

          {!isLoading && !loadError && filteredResources.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                <thead>
                  <tr style={{ background: '#f1f6fc', color: '#1e3a5f', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Capacity</th>
                    <th style={{ padding: '12px' }}>Location</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px' }}>{resource.name}</td>
                      <td style={{ padding: '12px' }}>{resource.type}</td>
                      <td style={{ padding: '12px' }}>{resource.capacity}</td>
                      <td style={{ padding: '12px' }}>{resource.location}</td>
                      <td style={{ padding: '12px' }}>{resource.status}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(resource)}
                            style={{
                              border: '1px solid #1d4e89',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: '#ffffff',
                              color: '#1d4e89',
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(resource.id)}
                            style={{
                              border: '1px solid #b91c1c',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: '#ffffff',
                              color: '#b91c1c',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </section>

      {isResourceModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0C447C]/45 p-4 backdrop-blur-sm sm:items-center">
          <div className="my-4 w-full max-w-2xl rounded-2xl border border-[#D6E5F4] bg-white p-6 shadow-xl sm:my-0 sm:max-h-[90vh] sm:overflow-y-auto">
            <div className="mb-5 flex items-center justify-between border-b border-[#E6F1FB] pb-3">
              <h2 className="text-xl font-bold text-[#0C447C]">
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </h2>
              <button
                type="button"
                onClick={closeResourceModal}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            {saveError ? (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {saveError}
              </div>
            ) : null}

            {isSaving ? (
              <div className="rounded-lg border border-[#D6E5F4] bg-[#F8FBFF] p-4 text-sm text-slate-600">
                Saving resource...
              </div>
            ) : (
              <ResourceForm
                initialData={editingResource}
                onSubmit={handleSaveResource}
                onCancel={closeResourceModal}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
    </AdminPortalLayout>
  );
}

export default ManageResourcesModernPage;
