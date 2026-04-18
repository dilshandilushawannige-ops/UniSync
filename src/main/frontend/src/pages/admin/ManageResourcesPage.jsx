import React, { useState, useEffect } from 'react';
import ResourceTable from '../../components/resource/ResourceTable';
import ResourceForm from '../../components/resource/ResourceForm';
import { getAllResources, createResource, updateResource, deleteResource, updateResourceStatus } from '../../services/resourceService';

const ManageResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getAllResources();
      setResources(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch resources');
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleAddResource = () => {
    setEditingResource(null);
    setShowModal(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResource(id)
        .then(() => {
          showMessage('success', 'Resource deleted successfully');
          fetchResources();
        })
        .catch((error) => {
          showMessage('error', 'Failed to delete resource');
          console.error('Error deleting resource:', error);
        });
    }
  };

  const handleStatusToggle = (id, newStatus) => {
    updateResourceStatus(id, newStatus)
      .then(() => {
        showMessage('success', 'Resource status updated successfully');
        fetchResources();
      })
      .catch((error) => {
        showMessage('error', 'Failed to update resource status');
        console.error('Error updating status:', error);
      });
  };

  const handleFormSubmit = (formData) => {
    const submitPromise = editingResource
      ? updateResource(editingResource.id, formData)
      : createResource(formData);

    submitPromise
      .then(() => {
        showMessage('success', editingResource ? 'Resource updated successfully' : 'Resource created successfully');
        setShowModal(false);
        setEditingResource(null);
        fetchResources();
      })
      .catch((error) => {
        showMessage('error', editingResource ? 'Failed to update resource' : 'Failed to create resource');
        console.error('Error:', error);
      });
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingResource(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Resources</h1>
        <button
          onClick={handleAddResource}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + Add Resource
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingResource ? 'Edit Resource' : 'Create New Resource'}
              </h2>
              <ResourceForm
                initialData={editingResource}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}

      <ResourceTable
        resources={resources}
        onEdit={handleEditResource}
        onDelete={handleDeleteResource}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
};

export default ManageResourcesPage;
