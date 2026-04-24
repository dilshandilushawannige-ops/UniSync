import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import ResourceForm from '../../components/resource/ResourceForm';
import { createResource, deleteResource, getAllResources, importResourcesCsv, updateResource } from '../../services/resourceService';
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
  const [isImporting, setIsImporting] = useState(false);

  const getResourceId = (resource) => resource?.id ?? resource?.resourceId ?? null;

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

  const getStatusBadgeStyle = (status) => {
    if (status === 'ACTIVE') {
      return {
        background: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac',
      };
    }

    if (status === 'OUT_OF_SERVICE') {
      return {
        background: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fca5a5',
      };
    }

    return {
      background: '#e2e8f0',
      color: '#334155',
      border: '1px solid #cbd5e1',
    };
  };

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
    setEditingResource({ ...resource, id: getResourceId(resource) });
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
      const editingId = getResourceId(editingResource);

      if (editingId) {
        await updateResource(editingId, formData);
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
    if (!resourceId) {
      setLoadError('Missing resource ID. Please refresh and try again.');
      return;
    }

    const result = await Swal.fire({
      title: 'Delete resource?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#b91c1c',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteResource(resourceId);
      await Swal.fire({
        title: 'Deleted',
        text: 'Resource was deleted successfully.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
      });
      await loadResources();
    } catch (error) {
      setLoadError(error?.response?.data?.message || 'Failed to delete resource.');
      await Swal.fire({
        title: 'Delete failed',
        text: error?.response?.data?.message || 'Failed to delete resource.',
        icon: 'error',
      });
    }
  };

  const handleImportCsv = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const result = await Swal.fire({
      title: 'Import resources from CSV?',
      text: 'This will add resources row by row. Invalid rows will be skipped with errors.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Import',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    setIsImporting(true);
    try {
      const response = await importResourcesCsv(file);
      const data = response?.data;
      const created = data?.created ?? 0;
      const failed = data?.failed ?? 0;
      const totalRows = data?.totalRows ?? 0;
      const errors = Array.isArray(data?.errors) ? data.errors : [];

      const errorPreview = errors
        .slice(0, 6)
        .map((err) => `Row ${err.rowNumber}: ${err.message}`)
        .join('\n');

      await Swal.fire({
        title: 'Import finished',
        icon: failed > 0 ? 'warning' : 'success',
        text:
          `Total rows: ${totalRows}\n` +
          `Created: ${created}\n` +
          `Failed: ${failed}` +
          (errorPreview ? `\n\nErrors:\n${errorPreview}` : ''),
        confirmButtonText: 'OK',
      });

      await loadResources();
    } catch (error) {
      await Swal.fire({
        title: 'Import failed',
        text: error?.response?.data?.message || 'Failed to import CSV.',
        icon: 'error',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
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

            <article className="stat-glass out">
              <div className="stat-icon">!</div>
              <p className="stat-value">{summary.outOfService}</p>
              <p className="stat-label">OUT OF SERVICE</p>
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
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleImportCsv}
              style={{ display: 'none' }}
              id="resourceCsvInput"
            />
            <label
              htmlFor="resourceCsvInput"
              className="add-btn"
              style={{
                background: '#0b3a66',
                opacity: isImporting ? 0.7 : 1,
                pointerEvents: isImporting ? 'none' : 'auto',
              }}
            >
              {isImporting ? 'Importing...' : 'Import CSV'}
            </label>
            <button type="button" className="add-btn" onClick={openCreateModal}>+ Add Resource</button>
          </div>
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
                  {filteredResources.map((resource) => {
                    const resourceId = getResourceId(resource);

                    return (
                    <tr key={resourceId ?? `${resource.name}-${resource.location}`} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px' }}>{resource.name}</td>
                      <td style={{ padding: '12px' }}>{resource.type}</td>
                      <td style={{ padding: '12px' }}>{resource.capacity}</td>
                      <td style={{ padding: '12px' }}>{resource.location}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            ...getStatusBadgeStyle(resource.status),
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: '999px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 700,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                          }}
                        >
                          {resource.status === 'OUT_OF_SERVICE' ? 'Out of Service' : resource.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(resource)}
                            disabled={!resourceId}
                            style={{
                              border: '1px solid #1d4e89',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: '#ffffff',
                              color: '#1d4e89',
                              cursor: resourceId ? 'pointer' : 'not-allowed',
                              opacity: resourceId ? 1 : 0.5,
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(resourceId)}
                            disabled={!resourceId}
                            style={{
                              border: '1px solid #b91c1c',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: '#ffffff',
                              color: '#b91c1c',
                              cursor: resourceId ? 'pointer' : 'not-allowed',
                              opacity: resourceId ? 1 : 0.5,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </section>

      {isResourceModalOpen ? (
        <div className="resource-modal-overlay">
          <div className="resource-modal-content">
            <div className="resource-modal-header">
              <h2 className="resource-modal-title">
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </h2>
              <button
                type="button"
                onClick={closeResourceModal}
                className="resource-modal-close"
              >
                Close
              </button>
            </div>

            {saveError ? (
              <div className="resource-save-error">
                {saveError}
              </div>
            ) : null}

            {isSaving ? (
              <div className="resource-saving-box">
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
  );
}

export default ManageResourcesModernPage;
