import api from './api';

/**
 * Resource Service
 * Handles all API calls related to resources
 */

/**
 * Get all resources
 * @returns {Promise} List of all resources
 */
export const getAllResources = () => {
  return api.get('/resources');
};

/**
 * Get a resource by ID
 * @param {number} id - The resource ID
 * @returns {Promise} Resource data
 */
export const getResourceById = (id) => {
  return api.get(`/resources/${id}`);
};

/**
 * Search resources with optional filters
 * @param {Object} params - Search parameters
 * @param {string} params.type - Resource type filter (optional)
 * @param {number} params.minCapacity - Minimum capacity filter (optional)
 * @param {string} params.location - Location filter (optional)
 * @returns {Promise} List of filtered resources
 */
export const searchResources = (params) => {
  return api.get('/resources/search', { params });
};

/**
 * Create a new resource
 * @param {Object} data - Resource data
 * @returns {Promise} Created resource
 */
export const createResource = (data) => {
  return api.post('/resources', data);
};

/**
 * Update an existing resource
 * @param {number} id - The resource ID
 * @param {Object} data - Updated resource data
 * @returns {Promise} Updated resource
 */
export const updateResource = (id, data) => {
  return api.put(`/resources/${id}`, data);
};

/**
 * Delete a resource
 * @param {number} id - The resource ID
 * @returns {Promise} Response status
 */
export const deleteResource = (id) => {
  return api.delete(`/resources/${id}`);
};

/**
 * Update resource status
 * @param {number} id - The resource ID
 * @param {string} status - New status (ACTIVE, OUT_OF_SERVICE, etc.)
 * @returns {Promise} Updated resource
 */
export const updateResourceStatus = (id, status) => {
  return api.patch(`/resources/${id}/status`, null, {
    params: { status },
  });
};
