import api from "./api";

export const getAllResources = () => api.get("/resources");

export const getResourceById = (id) => api.get(`/resources/${id}`);

export const searchResources = (params) => api.get("/resources/search", { params });

export const createResource = (data) => api.post("/resources", data);

export const updateResource = (id, data) => api.put(`/resources/${id}`, data);

export const deleteResource = (id) => api.delete(`/resources/${id}`);

export const updateResourceStatus = (id, status) =>
  api.patch(`/resources/${id}/status`, null, {
    params: { status },
  });

export const importResourcesCsv = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/resources/import/csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
