import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ResourceTable = ({ resources, onEdit, onDelete, onStatusToggle }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'ADMIN';

  const getStatusBadge = (status) => {
    const badgeClass = status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
        {status}
      </span>
    );
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No resources found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{resource.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{resource.type}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{resource.capacity}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{resource.location}</td>
              <td className="px-6 py-4 text-sm">{getStatusBadge(resource.status)}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex justify-center gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(resource)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onStatusToggle(resource.id, resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs font-medium"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => onDelete(resource.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
