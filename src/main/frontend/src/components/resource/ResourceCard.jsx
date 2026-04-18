import React from 'react';

const ResourceCard = ({ resource }) => {
  const getTypeIcon = (type) => {
    if (type === 'LAB') return 'flask';
    if (type === 'LECTURE_HALL' || type === 'MEETING_ROOM') return 'room';
    return 'equipment';
  };

  const iconType = getTypeIcon(resource.type);
  const isActive = resource.status === 'ACTIVE';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {iconType === 'flask' && (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 3h4" />
                <path d="M11 3v5l-5 8a4 4 0 0 0 3.4 6h5.2A4 4 0 0 0 18 16l-5-8V3" />
              </svg>
            )}
            {iconType === 'room' && (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 21h18" />
                <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
                <path d="M10 10h4" />
              </svg>
            )}
            {iconType === 'equipment' && (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14.7 6.3 17.7 3.3a2 2 0 0 1 2.8 2.8l-3 3" />
                <path d="m13 8 3 3-7.5 7.5a2 2 0 0 1-2.8 0l-.2-.2a2 2 0 0 1 0-2.8Z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{resource.name}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {resource.status}
        </span>
      </div>

      <dl className="space-y-3 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 font-medium text-slate-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 5h10" />
              <path d="M7 12h10" />
              <path d="M7 19h10" />
            </svg>
            Type
          </dt>
          <dd className="text-right font-medium">{resource.type}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 font-medium text-slate-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Capacity
          </dt>
          <dd className="text-right font-medium">{resource.capacity}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 font-medium text-slate-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-6-5.2-6-11a6 6 0 1 1 12 0c0 5.8-6 11-6 11Z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
            Location
          </dt>
          <dd className="text-right font-medium">{resource.location}</dd>
        </div>
      </dl>
    </article>
  );
};

export default ResourceCard;
