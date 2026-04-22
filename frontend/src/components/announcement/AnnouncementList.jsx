import './AnnouncementList.css';

function AnnouncementList({ announcements, userRole }) {
    // Filter announcements based on user role
    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.status === 'ACTIVE' &&
        (announcement.target.includes('ALL') || announcement.target.includes(userRole))
    );

    if (filteredAnnouncements.length === 0) {
        return (
            <div className="no-announcements">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p>No announcements at this time</p>
            </div>
        );
    }

    return (
        <div className="announcement-list">
            {filteredAnnouncements.map((announcement) => (
                <div
                    key={announcement.id}
                    className={`announcement-item ${announcement.priority === 'IMPORTANT' ? 'important' : ''}`}
                >
                    <div className="announcement-header-item">
                        <div className="announcement-icon">
                            {announcement.priority === 'IMPORTANT' ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            )}
                        </div>
                        <div className="announcement-meta">
                            <span className={`priority-label ${announcement.priority.toLowerCase()}`}>
                                {announcement.priority}
                            </span>
                            <span className="announcement-date">{announcement.createdAt}</span>
                        </div>
                    </div>
                    <h3 className="announcement-title-item">{announcement.title}</h3>
                    <p className="announcement-message-item">{announcement.message}</p>
                </div>
            ))}
        </div>
    );
}

export default AnnouncementList;
