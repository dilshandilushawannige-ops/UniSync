import React from 'react';

const ResourceCard = ({ resource, onViewDetails, onBookNow }) => {
  const isActive = resource.status === 'ACTIVE';
  const typeLabel = String(resource.type || 'N/A')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

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

  return (
    <article className="rounded-2xl border border-[#d9e3ef] bg-[#fcfeff] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex rounded-full bg-[#e7f8ef] px-3 py-1 text-xs font-semibold text-[#2f7f5d]">
          {typeLabel}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            isActive ? 'bg-[#d9f4e6] text-[#1d8b58]' : 'bg-[#fbe7ec] text-[#be3754]'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#23af67]' : 'bg-[#dc4d70]'}`} />
          <span className="leading-tight">{isActive ? 'Active' : 'Out of Service'}</span>
        </span>
      </div>

      <h3 className="mb-1 text-[36px] font-bold leading-tight text-[#1f3d6c]">
        {resource.name}
      </h3>

      <div className="space-y-1 text-[14px] text-[#445f7f]">
        <p>Capacity: {resource.capacity}</p>
        <p>Location: {resource.location}</p>
        <p>Availability: {formatAvailability(resource)}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onViewDetails?.(resource)}
          className="rounded-xl border border-[#d2dae5] bg-white px-3 py-2 text-[15px] font-semibold text-[#2a405a] transition hover:bg-[#f8fbff]"
        >
          View Details
        </button>
        <button
          type="button"
          disabled={!isActive}
          onClick={() => onBookNow?.(resource)}
          className={`rounded-xl px-3 py-2 text-[15px] font-semibold text-white transition ${
            isActive
              ? 'bg-[#123a66] hover:bg-[#0f3154]'
              : 'cursor-not-allowed bg-[#cbd6e4] text-[#eef3f9] opacity-90'
          }`}
        >
          Booking Now
        </button>
      </div>
    </article>
  );
};

export default ResourceCard;
