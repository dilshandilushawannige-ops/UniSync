import React from 'react';

const ResourceCard = ({ resource, onViewDetails, onBookNow }) => {
  const iconClassByType = {
    LAB: 'text-[#2567AE]',
    LECTURE_HALL: 'text-[#2E8B57]',
    EQUIPMENT: 'text-[#9B6B00]',
    MEETING_ROOM: 'text-[#A33A6B]',
  };

  const iconClass = iconClassByType[resource.type] || 'text-[#2567AE]';
  const isActive = resource.status === 'ACTIVE';

  const formatTimeDisplay = (value) => {
    if (!value) return '';

    const trimmed = String(value).trim();
    const twelveHourMatch = trimmed.match(/^(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)$/i);
    if (twelveHourMatch) {
      const hour = Number(twelveHourMatch[1]);
      const minute = twelveHourMatch[2];
      const period = twelveHourMatch[3].toUpperCase();
      if (!Number.isNaN(hour)) {
        return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
      }
    }

    const twentyFourHourMatch = trimmed.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
    if (twentyFourHourMatch) {
      const hour = Number(twentyFourHourMatch[1]);
      const minute = twentyFourHourMatch[2];
      if (!Number.isNaN(hour)) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = String(hour % 12 || 12).padStart(2, '0');
        return `${displayHour}:${minute} ${period}`;
      }
    }

    return trimmed;
  };

  const formatAvailability = (item) => {
    const startTime = formatTimeDisplay(item?.availableFrom);
    const endTime = formatTimeDisplay(item?.availableTo);

    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }

    if (startTime) {
      return `${startTime} - N/A`;
    }

    if (endTime) {
      return `N/A - ${endTime}`;
    }

    return item?.availabilityWindows || 'N/A';
  };

  const renderTypeIcon = (type) => {
    if (type === 'LAB') {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M10 3h4" />
          <path d="M11 3v5l-5.2 8.2A3.6 3.6 0 0 0 8.9 22h6.2a3.6 3.6 0 0 0 3.1-5.8L13 8V3" />
        </svg>
      );
    }
    if (type === 'LECTURE_HALL') {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M3 5h18" />
          <path d="M5 5v14h14V5" />
          <path d="M8 9h8" />
          <path d="M8 13h8" />
        </svg>
      );
    }
    if (type === 'MEETING_ROOM') {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M4 12h16" />
          <path d="M7 12V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
          <path d="M6 12v4" />
          <path d="M18 12v4" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M14.7 6.3 17.7 3.3a2 2 0 1 1 2.8 2.8l-3 3" />
        <path d="m13 8 3 3-7.5 7.5a2 2 0 0 1-2.8 0l-.2-.2a2 2 0 0 1 0-2.8Z" />
      </svg>
    );
  };

  return (
    <article className="rounded-2xl border border-[#9ec3ea] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F1FB] ${iconClass}`}>
              {renderTypeIcon(resource.type)}
        </div>
      </div>

      <h3 className="mb-2 text-sm font-semibold text-[#0f3d74]">{resource.name}</h3>

      <div className="space-y-1.5 text-xs text-[#164f8d]">
        <p>Type: {resource.type}</p>
        <p>Capacity: {resource.capacity}</p>
        <p>Location: {resource.location}</p>
        <p>Availability: {formatAvailability(resource)}</p>
      </div>

      <div className="mt-6">
        <span
          className={`inline-flex rounded-full px-4 py-1.5 text-[24px] font-semibold ${
            isActive ? 'bg-[#dce7cf] text-[#447a2e]' : 'bg-[#f2dfdf] text-[#a34040]'
          }`}
        >
          {resource.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onViewDetails?.(resource)}
          className="rounded-xl border border-[#c9d8ea] bg-white px-3 py-2 text-[16px] font-semibold text-[#0f3d74] transition hover:bg-[#f3f8ff]"
        >
          View Details
        </button>
        <button
          type="button"
          disabled={!isActive}
          onClick={() => onBookNow?.(resource)}
          className={`rounded-xl px-3 py-2 text-[16px] font-semibold text-white transition ${
            isActive
              ? 'bg-[#123a66] hover:bg-[#0f3154]'
              : 'bg-slate-300 text-slate-100 cursor-not-allowed'
          }`}
        >
          Booking Now
        </button>
      </div>
    </article>
  );
};

export default ResourceCard;
