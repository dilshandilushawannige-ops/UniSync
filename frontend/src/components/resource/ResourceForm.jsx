import React, { useState } from 'react';

const TYPE_OPTIONS = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
const STATUS_OPTIONS = ['ACTIVE', 'OUT_OF_SERVICE'];
const DEFAULT_START_TIME_DISPLAY = '08 : 00 AM';
const DEFAULT_END_TIME_DISPLAY = '05 : 00 PM';

const toLabel = (value) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const normalizeTimeValue = (value) => {
  if (!value) return '';
  return String(value).slice(0, 5);
};

const normalizeDateValue = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const toDisplayTime = (value) => {
  const normalized = normalizeTimeValue(value);
  if (!normalized) return '';

  const [hourValue, minuteValue] = normalized.split(':');
  const hourNumber = Number(hourValue);

  if (Number.isNaN(hourNumber) || !minuteValue) {
    return normalized;
  }

  const period = hourNumber >= 12 ? 'PM' : 'AM';
  const displayHour = String(hourNumber % 12 || 12).padStart(2, '0');
  return `${displayHour} : ${minuteValue} ${period}`;
};

const parseDisplayTime = (value) => {
  const fallback = { hour: '12', minute: '00', period: 'AM' };
  if (!value) {
    return fallback;
  }

  const match = String(value).match(/^(\d{2})\s:\s(\d{2})\s(AM|PM)$/i);
  if (!match) {
    return fallback;
  }

  return {
    hour: match[1],
    minute: match[2],
    period: match[3].toUpperCase(),
  };
};

const formatDraftTime = (draft) => `${draft.hour} : ${draft.minute} ${draft.period}`;

const toApiLocalTime = (value) => {
  if (!value) return null;

  const trimmed = String(value).trim();
  const displayMatch = trimmed.match(/^(\d{2})\s:\s(\d{2})\s(AM|PM)$/i);
  if (displayMatch) {
    const hour12 = Number(displayMatch[1]);
    const minute = displayMatch[2];
    const period = displayMatch[3].toUpperCase();

    if (!Number.isNaN(hour12) && hour12 >= 1 && hour12 <= 12) {
      const hour24 = period === 'AM' ? (hour12 % 12) : (hour12 % 12) + 12;
      return `${String(hour24).padStart(2, '0')}:${minute}:00`;
    }
  }

  const normalized = normalizeTimeValue(trimmed);
  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
};

const ResourceForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'LECTURE_HALL',
    capacity: initialData?.capacity ?? '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    status: initialData?.status || 'ACTIVE',
    bookingDate: normalizeDateValue(initialData?.bookingDate),
    startTime: toDisplayTime(initialData?.availableFrom) || DEFAULT_START_TIME_DISPLAY,
    endTime: toDisplayTime(initialData?.availableTo) || DEFAULT_END_TIME_DISPLAY,
    numberOfPeople: '',
  });

  const [openPicker, setOpenPicker] = useState(null);
  const [dateDraft, setDateDraft] = useState(normalizeDateValue(initialData?.bookingDate));
  const [timeDraft, setTimeDraft] = useState({
    startTime: parseDisplayTime(toDisplayTime(initialData?.availableFrom)),
    endTime: parseDisplayTime(toDisplayTime(initialData?.availableTo)),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openTimePicker = (fieldName) => {
    setOpenPicker(fieldName);
    setTimeDraft((prev) => ({
      ...prev,
      [fieldName]: parseDisplayTime(formData[fieldName]),
    }));
  };

  const openDatePicker = () => {
    setOpenPicker('bookingDate');
    setDateDraft(normalizeDateValue(formData.bookingDate));
  };

  const commitDateDraft = () => {
    setFormData((prev) => ({
      ...prev,
      bookingDate: dateDraft,
    }));
    setOpenPicker(null);
  };

  const updateTimeDraft = (fieldName, key, value) => {
    setTimeDraft((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [key]: value,
      },
    }));
  };

  const commitTimeDraft = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: formatDraftTime(timeDraft[fieldName]),
    }));
    setOpenPicker(null);
  };

  const handlePickerBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenPicker(null);
    }
  };

  const renderTimePicker = (fieldName, label) => {
    const draft = timeDraft[fieldName];

    return (
      <div className="relative" onBlur={handlePickerBlur}>
        <div className="mb-2">
          <FormLabel>{label}</FormLabel>
        </div>
        <div className="relative">
          <input
            readOnly
            name={fieldName}
            value={formData[fieldName]}
            placeholder="-- : -- --"
            onClick={() => openTimePicker(fieldName)}
            className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 pr-12 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9] cursor-pointer"
          />
          <button
            type="button"
            onClick={() => openTimePicker(fieldName)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-[#6b7c93] transition hover:text-[#0C447C]"
            aria-label={`Open ${label.toLowerCase()} picker`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M12 8v5l3 2" />
              <circle cx="12" cy="12" r="8" />
            </svg>
          </button>

          {openPicker === fieldName ? (
            <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border border-[#d5dde8] bg-white p-4 shadow-lg">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#6b7c93]">
                    Hour
                  </span>
                  <select
                    value={draft.hour}
                    onChange={(event) => updateTimeDraft(fieldName, 'hour', event.target.value)}
                    className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-3 py-2.5 text-sm text-[#233f5b] outline-none focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
                  >
                    {Array.from({ length: 12 }, (_, index) => {
                      const hourValue = String(index + 1).padStart(2, '0');
                      return (
                        <option key={hourValue} value={hourValue}>
                          {hourValue}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#6b7c93]">
                    Minute
                  </span>
                  <select
                    value={draft.minute}
                    onChange={(event) => updateTimeDraft(fieldName, 'minute', event.target.value)}
                    className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-3 py-2.5 text-sm text-[#233f5b] outline-none focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
                  >
                    {Array.from({ length: 60 }, (_, index) => {
                      const minuteValue = String(index).padStart(2, '0');
                      return (
                        <option key={minuteValue} value={minuteValue}>
                          {minuteValue}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {['AM', 'PM'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => updateTimeDraft(fieldName, 'period', period)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      draft.period === period
                        ? 'border-[#0C447C] bg-[#0C447C] text-white'
                        : 'border-[#d5dde8] bg-[#f8fbff] text-[#233f5b] hover:border-[#9abadd]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => commitTimeDraft(fieldName)}
                  className="rounded-xl bg-[#0C447C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Done
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderDatePicker = (label) => (
    <div className="relative" onBlur={handlePickerBlur}>
      <div className="mb-2">
        <FormLabel>{label}</FormLabel>
      </div>
      <div className="relative">
        <input
          readOnly
          name="bookingDate"
          value={formData.bookingDate}
          placeholder="-- / -- / ----"
          onClick={openDatePicker}
          className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-4 py-3 pr-12 text-sm text-[#233f5b] outline-none transition focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9] cursor-pointer"
        />
        <button
          type="button"
          onClick={openDatePicker}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-[#6b7c93] transition hover:text-[#0C447C]"
          aria-label="Open booking date picker"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M7 3v4M17 3v4M4 9h16" />
            <rect x="4" y="5" width="16" height="16" rx="2" />
          </svg>
        </button>

        {openPicker === 'bookingDate' ? (
          <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border border-[#d5dde8] bg-white p-4 shadow-lg">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#6b7c93]">
                Date
              </span>
              <input
                type="date"
                value={dateDraft}
                onChange={(event) => setDateDraft(event.target.value)}
                className="w-full rounded-xl border border-[#d5dde8] bg-[#f8fbff] px-3 py-2.5 text-sm text-[#233f5b] outline-none focus:border-[#9abadd] focus:ring-2 focus:ring-[#d9e8f9]"
              />
            </label>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={commitDateDraft}
                className="rounded-xl bg-[#0C447C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();

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
      availableFrom: toApiLocalTime(formData.startTime),
      availableTo: toApiLocalTime(formData.endTime),
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
        <div>
          <div className="mb-2 flex items-center justify-between">
            <FormLabel required>Capacity (People)</FormLabel>
            <span className="text-xs font-medium text-slate-500">{formData.capacity.length}/100</span>
          </div>
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

      </section>

      <section className="space-y-4 border-b border-[#e0e8f2] pb-6">
        <SectionHeader>Scheduling</SectionHeader>

        <div>
          {renderDatePicker('Weekly Availability (Optional)')}
        </div>

      </section>

      <section className="space-y-4 border-b border-[#e0e8f2] pb-6">
        <div className="grid grid-cols-2 gap-4">
          {renderTimePicker('startTime', 'Start Time (Optional)')}
          {renderTimePicker('endTime', 'End Time (Optional)')}
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



