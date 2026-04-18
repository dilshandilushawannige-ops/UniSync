import React, { useMemo, useState } from 'react';

const TYPE_OPTIONS = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
const STATUS_OPTIONS = ['ACTIVE', 'OUT_OF_SERVICE'];

const ResourceForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = useMemo(() => Boolean(initialData && initialData.id), [initialData]);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'LECTURE_HALL',
    capacity: initialData?.capacity ?? '',
    location: initialData?.location || '',
    availabilityWindows: initialData?.availabilityWindows || '',
    status: initialData?.status || 'ACTIVE',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      capacity: Number(formData.capacity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-1">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#0C447C]">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-[#c8dcf0] bg-[#F8FBFF] px-3.5 py-2.5 outline-none ring-[#9ac2e8] focus:ring"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#0C447C]">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#c8dcf0] bg-[#F8FBFF] px-3.5 py-2.5 outline-none ring-[#9ac2e8] focus:ring"
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#0C447C]">Capacity</label>
          <input
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-[#c8dcf0] bg-[#F8FBFF] px-3.5 py-2.5 outline-none ring-[#9ac2e8] focus:ring"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#0C447C]">Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-[#c8dcf0] bg-[#F8FBFF] px-3.5 py-2.5 outline-none ring-[#9ac2e8] focus:ring"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#0C447C]">Availability Windows</label>
        <input
          name="availabilityWindows"
          value={formData.availabilityWindows}
          onChange={handleChange}
          placeholder="MON-FRI 08:00-18:00"
          className="w-full rounded-xl border border-[#c8dcf0] bg-[#F8FBFF] px-3.5 py-2.5 outline-none ring-[#9ac2e8] focus:ring"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#0C447C]">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-xl border border-[#c8dcf0] bg-[#F8FBFF] px-3.5 py-2.5 outline-none ring-[#9ac2e8] focus:ring"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#c8dcf0] px-4 py-2.5 text-slate-700 hover:bg-[#F8FBFF]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-[#0C447C] to-[#378ADD] px-4 py-2.5 font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          {isEditMode ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;
