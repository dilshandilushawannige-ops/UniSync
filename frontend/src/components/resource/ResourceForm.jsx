import React, { useMemo, useState } from 'react';

const TYPE_OPTIONS = [
  { label: 'Lecture Hall', value: 'LECTURE_HALL' },
  { label: 'Lab', value: 'LAB' },
  { label: 'Meeting Room', value: 'MEETING_ROOM' },
  { label: 'Equipment', value: 'EQUIPMENT' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Out of Service', value: 'OUT_OF_SERVICE' },
];

const DAY_OPTIONS = [
  { label: 'Monday', short: 'MON' },
  { label: 'Tuesday', short: 'TUE' },
  { label: 'Wednesday', short: 'WED' },
  { label: 'Thursday', short: 'THU' },
  { label: 'Friday', short: 'FRI' },
  { label: 'Saturday', short: 'SAT' },
  { label: 'Sunday', short: 'SUN' },
];

const dayIndexMap = DAY_OPTIONS.reduce((acc, day, index) => {
  acc[day.short] = index;
  return acc;
}, {});

const parseAvailabilityWindows = (availabilityWindows) => {
  const fallback = {
    selectedDays: [],
    fromTime: '08:00',
    toTime: '17:00',
  };

  if (!availabilityWindows) {
    return fallback;
  }

  const match = availabilityWindows
    .trim()
    .toUpperCase()
    .match(/^([A-Z,-]+)\s+([0-2]\d:[0-5]\d)-([0-2]\d:[0-5]\d)$/);

  if (!match) {
    return fallback;
  }

  const dayPart = match[1];
  let selectedDays = [];

  if (dayPart.includes('-') && !dayPart.includes(',')) {
    const [start, end] = dayPart.split('-');
    const startIndex = dayIndexMap[start];
    const endIndex = dayIndexMap[end];

    if (startIndex !== undefined && endIndex !== undefined && startIndex <= endIndex) {
      selectedDays = DAY_OPTIONS.slice(startIndex, endIndex + 1).map((day) => day.short);
    }
  } else {
    selectedDays = dayPart
      .split(',')
      .map((day) => day.trim())
      .filter((day) => dayIndexMap[day] !== undefined);
  }

  return {
    selectedDays,
    fromTime: match[2],
    toTime: match[3],
  };
};

const formatSelectedDaysPreview = (selectedDays) => {
  if (selectedDays.length === 0) {
    return 'Select days';
  }

  const labels = selectedDays
    .map((short) => DAY_OPTIONS.find((day) => day.short === short)?.label)
    .filter(Boolean);

  if (labels.length <= 3) {
    return labels.join(', ');
  }

  return `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`;
};

const formatDaysForSubmission = (selectedDays) => {
  if (selectedDays.length === 0) {
    return '';
  }

  const sortedDays = [...selectedDays].sort((a, b) => dayIndexMap[a] - dayIndexMap[b]);
  const indices = sortedDays.map((day) => dayIndexMap[day]);
  const isContiguous = indices.every((index, idx) => idx === 0 || index - indices[idx - 1] === 1);

  if (isContiguous && sortedDays.length > 1) {
    return `${sortedDays[0]}-${sortedDays[sortedDays.length - 1]}`;
  }

  return sortedDays.join(',');
};

const ResourceForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = useMemo(() => Boolean(initialData && initialData.id), [initialData]);
  const parsedAvailability = useMemo(
    () => parseAvailabilityWindows(initialData?.availabilityWindows),
    [initialData?.availabilityWindows]
  );

  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'LECTURE_HALL',
    status: initialData?.status || 'ACTIVE',
    location: initialData?.location || '',
    capacity: initialData?.capacity ?? 10,
    description: initialData?.description || '',
  });

  const [availability, setAvailability] = useState({
    selectedDays: parsedAvailability.selectedDays,
    fromTime: parsedAvailability.fromTime,
    toTime: parsedAvailability.toTime,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (event) => {
    const { name, value } = event.target;
    setAvailability((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDaySelection = (dayShort) => {
    setAvailability((prev) => {
      const exists = prev.selectedDays.includes(dayShort);
      const nextSelected = exists
        ? prev.selectedDays.filter((day) => day !== dayShort)
        : [...prev.selectedDays, dayShort];

      return {
        ...prev,
        selectedDays: nextSelected,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const dayPart = formatDaysForSubmission(availability.selectedDays);
    const availabilityWindows = dayPart
      ? `${dayPart} ${availability.fromTime}-${availability.toTime}`
      : '';

    onSubmit({
      ...formData,
      availabilityWindows,
      capacity: Number(formData.capacity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create New Resource</h2>
      </div>

      <div className="space-y-7">
        <section>
          <p className="mb-4 text-left text-xs font-extrabold uppercase tracking-[0.22em] text-[#2563EB]">
            Basic Information
          </p>

          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                  Resource Name
                </label>
                <span className="text-xs font-medium text-slate-400">{formData.name.length}/100</span>
              </div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g., Room 101"
                required
                className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                  Location
                </label>
                <span className="text-xs font-medium text-slate-400">{formData.location.length}/100</span>
              </div>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g., Building A, 2nd Floor"
                required
                className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
          </div>
        </section>

        <section>
          <p className="mb-4 text-left text-xs font-extrabold uppercase tracking-[0.22em] text-[#2563EB]">
            Capacity &amp; Availability
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                Capacity (People)
              </label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                Weekly Availability (Optional)
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDayDropdownOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base" aria-hidden="true">📅</span>
                    <span>{formatSelectedDaysPreview(availability.selectedDays)}</span>
                  </span>
                  <span className="text-xs text-slate-500">▼</span>
                </button>

                {isDayDropdownOpen ? (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                    <div className="space-y-2">
                      {DAY_OPTIONS.map((day) => (
                        <label key={day.short} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={availability.selectedDays.includes(day.short)}
                            onChange={() => toggleDaySelection(day.short)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
                          />
                          <span className="text-sm text-slate-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    From Time
                  </label>
                  <input
                    type="time"
                    name="fromTime"
                    value={availability.fromTime}
                    onChange={handleTimeChange}
                    className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    To Time
                  </label>
                  <input
                    type="time"
                    name="toTime"
                    value={availability.toTime}
                    onChange={handleTimeChange}
                    className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-4 text-left text-xs font-extrabold uppercase tracking-[0.22em] text-[#2563EB]">
            Details
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add a short description of this resource"
                className="w-full rounded-xl border border-slate-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#0C2D57] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#081e3a]"
        >
          {isEditMode ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;
