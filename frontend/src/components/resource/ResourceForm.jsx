import React, { useState } from 'react';
import Swal from 'sweetalert2';

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
  });

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validate booking date - prevent past dates
    if (name === 'bookingDate' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
      
      if (selectedDate < today) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Date',
          text: 'Please select today or a future date. Past dates are not allowed.',
          confirmButtonColor: '#3B82F6',
          confirmButtonText: 'OK'
        });
        return; // Don't update state with past date
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      name: formData.name,
      type: formData.type,
      capacity: Number(formData.capacity),
      location: formData.location,
      description: formData.description || null,
      availableFrom: toApiLocalTime(formData.startTime),
      availableTo: toApiLocalTime(formData.endTime),
      status: formData.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.formTitle}>
        {isEditMode ? 'Update Resource' : 'Create New Resource'}
      </h2>

      <div style={styles.section}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Resource Name <span style={styles.required}>*</span>
            <span style={styles.charCount}>{formData.name.length}/100</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="e.g., Room 101"
            style={styles.input}
          />
        </div>

        <div style={styles.gridTwo}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Type <span style={styles.required}>*</span></label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.input}
            >
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {toLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.input}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {toLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Location <span style={styles.required}>*</span>
            <span style={styles.charCount}>{formData.location.length}/100</span>
          </label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="e.g., Building A, 2nd Floor"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Capacity (People) <span style={styles.required}>*</span>
          </label>
          <input
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
            placeholder="e.g., 50"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Scheduling</h3>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Weekly Availability (Optional)</label>
          <input
            name="bookingDate"
            type="date"
            value={formData.bookingDate}
            onChange={handleChange}
            min={getTodayDate()}
            style={styles.input}
            title="Please select today or a future date"
          />
          <span style={styles.fieldHint}>Select a date (cannot be in the past)</span>
        </div>

        <div style={styles.gridTwo}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Start Time (Optional)</label>
            <input
              name="startTime"
              type="time"
              value={normalizeTimeValue(formData.startTime)}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>End Time (Optional)</label>
            <input
              name="endTime"
              type="time"
              value={normalizeTimeValue(formData.endTime)}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add extra notes about this resource"
            style={{...styles.input, ...styles.textarea}}
          />
        </div>
      </div>

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" style={styles.submitButton}>
          {isEditMode ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    textAlign: 'left',
    fontSize: '14px',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#163453',
    marginBottom: '24px',
    marginTop: 0,
  },
  section: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e0e8f2',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7c93',
    marginBottom: '16px',
    marginTop: 0,
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7c93',
    marginBottom: '8px',
  },
  required: {
    color: '#dc2626',
    marginLeft: '4px',
  },
  charCount: {
    float: 'right',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#94a3b8',
    textTransform: 'none',
  },
  fieldHint: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '6px',
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: '1px solid #d5dde8',
    background: '#f8fbff',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#233f5b',
    outline: 'none',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '8px',
  },
  cancelButton: {
    borderRadius: '12px',
    border: '1px solid #c8dcf0',
    padding: '10px 20px',
    fontWeight: '600',
    color: '#475569',
    background: 'white',
    cursor: 'pointer',
  },
  submitButton: {
    borderRadius: '12px',
    background: 'linear-gradient(to right, #0C447C, #378ADD)',
    padding: '10px 20px',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default ResourceForm;
