import React, { useEffect, useState } from 'react';
import AdminPortalLayout from '../../components/admin/AdminPortalLayout';
import ResourceForm from '../../components/resource/ResourceForm';
import ResourceTable from '../../components/resource/ResourceTable';
import {
  createResource,
  deleteResource,
  getAllResources,
  updateResource,
  updateResourceStatus,
} from '../../services/resourceService';

const ManageResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 2800);
  };

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const response = await getAllResources();
      setResources(response.data || []);
    } catch (error) {
      console.error('Failed to load resources', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const openCreateModal = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this resource?');
    if (!confirmed) return;

    try {
      await deleteResource(id);
      showMessage('success', 'Resource deleted successfully.');
      await loadResources();
    } catch (error) {
      showMessage('error', 'Failed to delete resource.');
      console.error('Delete failed', error);
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await updateResourceStatus(id, newStatus);
      showMessage('success', 'Resource status updated.');
      await loadResources();
    } catch (error) {
      showMessage('error', 'Failed to update status.');
      console.error('Status update failed', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingResource?.id) {
        await updateResource(editingResource.id, formData);
      } else {
        await createResource(formData);
      }
      setIsModalOpen(false);
      setEditingResource(null);
      showMessage('success', editingResource?.id ? 'Resource updated successfully.' : 'Resource created successfully.');
      await loadResources();
    } catch (error) {
      showMessage('error', 'Failed to save resource.');
      console.error('Save failed', error);
    }
  };

  return (
    <AdminPortalLayout title="Manage Resources">
      <section style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Manage Resources</h1>
          <button onClick={openCreateModal} style={styles.addButton}>
            + Add Resource
          </button>
        </div>

        {message.text && (
          <div style={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
            {message.text}
          </div>
        )}

        {isLoading ? (
          <div style={styles.loadingBox}>
            Loading resources...
          </div>
        ) : (
          <ResourceTable
            resources={resources}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
          />
        )}

        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingResource ? 'Edit Resource' : 'Create Resource'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={styles.closeButton}>
                  Close
                </button>
              </div>

              <ResourceForm
                initialData={editingResource}
                onSubmit={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}
      </section>
    </AdminPortalLayout>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0C447C',
    margin: 0,
  },
  addButton: {
    borderRadius: '12px',
    background: 'linear-gradient(to right, #0C447C, #378ADD)',
    padding: '10px 16px',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  successMessage: {
    marginBottom: '16px',
    borderRadius: '12px',
    border: '1px solid #d1fae5',
    padding: '12px 16px',
    fontSize: '0.875rem',
    fontWeight: '500',
    background: '#d1fae5',
    color: '#065f46',
  },
  errorMessage: {
    marginBottom: '16px',
    borderRadius: '12px',
    border: '1px solid #fee2e2',
    padding: '12px 16px',
    fontSize: '0.875rem',
    fontWeight: '500',
    background: '#fee2e2',
    color: '#991b1b',
  },
  loadingBox: {
    borderRadius: '12px',
    border: '1px solid #D6E5F4',
    background: 'white',
    padding: '32px',
    textAlign: 'center',
    color: '#64748b',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(12, 68, 124, 0.45)',
    padding: '16px',
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    width: '100%',
    maxWidth: '672px',
    borderRadius: '16px',
    border: '1px solid #D6E5F4',
    background: 'white',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #E6F1FB',
    paddingBottom: '12px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0C447C',
    margin: 0,
  },
  closeButton: {
    borderRadius: '6px',
    padding: '4px 8px',
    color: '#64748b',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
};

export default ManageResourcesPage;
