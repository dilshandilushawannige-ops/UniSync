import React from 'react';

const ResourceCard = ({ resource }) => {
  const styleByType = {
    LAB: {
      stripe: 'from-blue-500 to-blue-400',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      dot: 'bg-blue-500',
    },
    LECTURE_HALL: {
      stripe: 'from-emerald-500 to-emerald-400',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      dot: 'bg-emerald-500',
    },
    EQUIPMENT: {
      stripe: 'from-amber-500 to-amber-400',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      dot: 'bg-amber-500',
    },
    MEETING_ROOM: {
      stripe: 'from-pink-500 to-pink-400',
      iconBg: 'bg-pink-100',
      iconText: 'text-pink-600',
      dot: 'bg-pink-500',
    },
  };

  const typeStyle = styleByType[resource.type] || styleByType.LAB;
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
    <article className="overflow-hidden rounded-2xl border border-[#D6E5F4] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`h-1.5 bg-gradient-to-r ${typeStyle.stripe}`} />

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${typeStyle.iconBg} ${typeStyle.iconText}`}>
              {renderTypeIcon(resource.type)}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{resource.name}</h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {resource.status}
          </span>
        </div>

        <div className="space-y-2.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${typeStyle.dot}`} />
            <span className="font-medium text-slate-500">Type:</span>
            <span className="font-semibold text-slate-800">{resource.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#185FA5]" />
            <span className="font-medium text-slate-500">Capacity:</span>
            <span className="font-semibold text-slate-800">{resource.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#378ADD]" />
            <span className="font-medium text-slate-500">Location:</span>
            <span className="font-semibold text-slate-800">{resource.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#A8CBEA]" />
            <span className="font-medium text-slate-500">Availability:</span>
            <span className="font-semibold text-slate-800">
              {resource.availabilityWindows || 'Not specified'}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#E6F1FB] pt-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {resource.status}
          </span>
          <button className="rounded-lg bg-[#E6F1FB] px-3.5 py-1.5 text-xs font-semibold text-[#185FA5] transition hover:bg-[#d7e8f7]">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default ResourceCard;
