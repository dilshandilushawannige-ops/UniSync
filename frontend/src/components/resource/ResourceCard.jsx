import React from 'react';

const ResourceCard = ({ resource }) => {
  const iconClassByType = {
    LAB: 'text-[#2567AE]',
    LECTURE_HALL: 'text-[#2E8B57]',
    EQUIPMENT: 'text-[#9B6B00]',
    MEETING_ROOM: 'text-[#A33A6B]',
  };

  const iconClass = iconClassByType[resource.type] || 'text-[#2567AE]';
  const isActive = resource.status === 'ACTIVE';

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

      <h3 className="mb-2 text-[32px] font-semibold text-[#0f3d74]">{resource.name}</h3>

      <div className="space-y-1.5 text-[28px] text-[#164f8d]">
        <p>Type: {resource.type}</p>
        <p>Capacity: {resource.capacity}</p>
        <p>Location: {resource.location}</p>
        {resource.availabilityWindows && <p>Availability: {resource.availabilityWindows}</p>}
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
    </article>
  );
};

export default ResourceCard;
