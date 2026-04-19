import { useState } from 'react';
import AdminPortalLayout from '../../components/admin/AdminPortalLayout';
import AnnouncementForm from '../../components/announcement/AnnouncementForm';
import './ManageAnnouncementsPage.css';

function ManageAnnouncementsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [targetRole, setTargetRole] = useState('ALL');
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Sample data - replace with actual API call
    const [announcements] = useState([
        {
            id: 6,
            title: 'mid exam is postponed',
            message: 'It will announce later within website.',
            target: ['STUDENT', 'LECTURER'],
            priority: 'IMPORTANT',
            status: 'ACTIVE',
            createdAt: '4/11/2026, 1:13:05 PM'
        },
        {
            id: 5,
            title: 'Lectures canceled',
            message: 'Due to the aluth awrudda this week lectures are cancelled',
            target: ['LECTURER', 'STUDENT'],
            priority: 'NORMAL',
            status: 'ACTIVE',
            createdAt: '4/9/2026, 11:50:35 PM'
        },
        {
            id: 3,
            title: 'Library is closed',
            message: 'Due to the Aluth Awrudda Library is closed on April 13th and 14th',
            target: ['ALL'],
            priority: 'NORMAL',
            status: 'INACTIVE',
            createdAt: '4/9/2026, 11:29:55 PM'
        }
    ]);

    const stats = {
        total: 3,
        active: 2,
        important: 1,
        forAll: 1
    };

    const handleEdit = (id) => {
        console.log('Edit announcement:', id);
        // TODO: Implement edit functionality
    };

    const handleDelete = (id) => {
        console.log('Delete announcement:', id);
        // TODO: Implement delete functionality
    };

    const handleCreateAnnouncement = () => {
        setIsFormOpen(true);
    };

    const handleFormSubmit = (newAnnouncement) => {
        console.log('New announcement:', newAnnouncement);
        // TODO: Add API call to save announcement
        alert('Announcement created successfully!');
    };

    return (
        <AdminPortalLayout>
            <AnnouncementForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
            <div className="announcements-page">
                {/* Header Section */}
                <div className="announcements-header">
                    <div className="header-content">
                        <div className="header-text">
                            <span className="header-badge">COMMUNICATION CENTER</span>
                            <h1 className="header-title">Manage Announcements</h1>
                            <p className="header-subtitle">
                                Create role-based announcements and push them into the system notification flow.
                            </p>
                        </div>
                        <button className="btn-create-announcement" onClick={handleCreateAnnouncement}>
                            Create Announcement
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon pink">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Total Announcements</div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Active</div>
                            <div className="stat-value">{stats.active}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Important</div>
                            <div className="stat-value">{stats.important}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">For All Users</div>
                            <div className="stat-value">{stats.forAll}</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-group">
                        <label>Search Announcements</label>
                        <input
                            type="text"
                            placeholder="Search by title or message"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label>Target Role</label>
                        <select
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            className="role-select"
                        >
                            <option value="ALL">ALL</option>
                            <option value="STUDENT">STUDENT</option>
                            <option value="LECTURER">LECTURER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </div>

                {/* Announcements Table */}
                <div className="announcements-table-container">
                    <table className="announcements-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>TITLE</th>
                                <th>TARGET</th>
                                <th>PRIORITY</th>
                                <th>STATUS</th>
                                <th>CREATED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((announcement) => (
                                <tr key={announcement.id}>
                                    <td>{announcement.id}</td>
                                    <td>
                                        <div className="announcement-title-cell">
                                            <div className="announcement-title">{announcement.title}</div>
                                            <div className="announcement-message">{announcement.message}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="target-roles">
                                            {announcement.target.length === 1 && announcement.target[0] === 'ALL' ? (
                                                <div className="role-badge-group">
                                                    <span className="role-label">ALL USERS</span>
                                                    <span className="role-badge all">ALL</span>
                                                </div>
                                            ) : (
                                                <div className="role-badge-group">
                                                    <span className="role-label">{announcement.target.length} ROLES</span>
                                                    {announcement.target.map((role, idx) => (
                                                        <span key={idx} className={`role-badge ${role.toLowerCase()}`}>
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`priority-badge ${announcement.priority.toLowerCase()}`}>
                                            {announcement.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${announcement.status.toLowerCase()}`}>
                                            {announcement.status}
                                        </span>
                                    </td>
                                    <td className="created-date">{announcement.createdAt}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-action edit"
                                                onClick={() => handleEdit(announcement.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-action delete"
                                                onClick={() => handleDelete(announcement.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPortalLayout>
    );
}

export default ManageAnnouncementsPage;
