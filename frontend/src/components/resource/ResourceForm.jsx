import React, { useMemo, useState } from 'react';

const TYPE_OPTIONS = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
const STATUS_OPTIONS = ['ACTIVE', 'OUT_OF_SERVICE'];

const toLabel = (value) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const ResourceForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = useMemo(() => Boolean(initialData && initialData.id), [initialData]);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'LECTURE_HALL',
    capacity: initialData?.capacity ?? '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    availabilityWindows: initialData?.availabilityWindows || '',
    status: initialData?.status || 'ACTIVE',
    bookingDate: '',
    startTime: '',
    endTime: '',
    numberOfPeople: '',
  });

  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAvailabilityDayChange = (day) => {
    const current = formData.availabilityWindows ? formData.availabilityWindows.split(', ') : [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setFormData((prev) => ({ ...prev, availabilityWindows: updated.join(', ') }));
  };

  const getSelectedDays = () => {
    return formData.availabilityWindows ? formData.availabilityWindows.split(', ').filter(Boolean) : [];
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const generatedAvailability = [
      formData.bookingDate ? `Date: ${formData.bookingDate}` : null,
      formData.startTime ? `Start: ${formData.startTime}` : null,
      formData.endTime ? `End: ${formData.endTime}` : null,
    ]
      .filter(Boolean)
      .join(', ');

    const generatedDescription = [
      formData.description,
      formData.numberOfPeople ? `Suggested people: ${formData.numberOfPeople}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    onSubmit({
      name: formData.name,
      type: formData.type,
      capacity: Number(formData.capacity),
      location: formData.location,
      description: generatedDescription || null,
      availabilityWindows: formData.availabilityWindows || generatedAvailability || null,
      status: formData.status,
    });
  };

  const SectionHeader = ({ children }) => (
    <h3 className="text-xs font-bold uppercase tracking-widest text-[#6b7c93] mb-4">{children}</h3>
  );

  const FormLabel = ({ children, required }) => (
    <label className="text-xs font-bold uppercase tracking-widest text-[#6b7c93]">
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 text-left text-sm">
      <h2 className="text-[1.75rem] font-extrabold text-[#163453]">
        {isEditMode ? 'Update Resource' : 'Create New Resource'}
      </h2>

      <section className="space-y-4 border-b border-[#e0e8f2] pb-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <FormLabel required>Resource Name</FormLabel>
            <span className="text-xs font-medium text-slate-500">{formData.name.length}/100</span>
          </div>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="e.g., Room 101"
            className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel required>Type</FormLabel>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
            >
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {toLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FormLabel>Status</FormLabel>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {toLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <FormLabel required>Location</FormLabel>
            <span className="text-xs font-medium text-slate-500">{formData.location.length}/100</span>
          </div>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="e.g., Building A, 2nd Floor"
            className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
          />
        </div>
      </section>

      <section className="space-y-4 border-b border-[#e0e8f2] pb-6">
        <SectionHeader>Scheduling</SectionHeader>

        <div>
          <FormLabel required>Capacity (People)</FormLabel>
          <input
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
            placeholder="e.g., 50"
            className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
          />
        </div>

        <div className="relative">
          <FormLabel>Weekly Availability (Optional)</FormLabel>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
              className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9] text-left flex items-center justify-between cursor-pointer hover:border-[#9abadd]"
            >
              <span className="truncate">
                {formData.availabilityWindows || 'Select days...'}
              </span>
              <svg
                className={`w-4 h-4 text-[#6b7c93] transition-transform ${
                  showAvailabilityDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {showAvailabilityDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#d5dde8] rounded-xl shadow-lg p-3 z-10">
                <div className="grid grid-cols-2 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day} className="flex items-center cursor-pointer hover:bg-[#f8fbff] p-2 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={getSelectedDays().includes(day)}
                        onChange={() => handleAvailabilityDayChange(day)}
                        className="w-4 h-4 rounded border-[#d5dde8] text-[#0C447C] cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-[#233f5b] font-medium">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4 border-b border-[#e0e8f2] pb-6">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <FormLabel>Start Time (Optional)</FormLabel>
            </div>
            <input
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9] cursor-pointer appearance-none"
            />
          </div>

          <div>
            <div className="mb-2">
              <FormLabel>End Time (Optional)</FormLabel>
            </div>
            <input
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9] cursor-pointer appearance-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">

        <div>
          <FormLabel>Description (Optional)</FormLabel>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add extra notes about this resource"
            className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
          />
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#c8dcf0] px-5 py-2.5 font-semibold text-slate-700 hover:bg-[#F8FBFF]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-[#0C447C] to-[#378ADD] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          {isEditMode ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;



