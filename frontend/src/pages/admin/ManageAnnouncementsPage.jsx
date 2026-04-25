import { useState, useMemo } from 'react';
import AdminPortalLayout from '../../components/admin/AdminPortalLayout';
import AnnouncementForm from '../../components/announcement/AnnouncementForm';
import { useAnnouncements } from '../../context/AnnouncementContext';
import './ManageAnnouncementsPage.css';

// Import stat card images
import announcementIcon from '../../assets/announcment.png';
import activeIcon from '../../assets/active.png';
import importantIcon from '../../assets/imporant.png';
import allUsersIcon from '../../assets/all.png';

// Import action button images
import editIcon from '../../assets/edit.png';
import deleteIcon from '../../assets/delete.png';

function ManageAnnouncementsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [targetRole, setTargetRole] = useState('ALL');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();

    // Calculate stats
    const stats = {
        total: announcements.length,
        active: announcements.filter(a => a.status === 'ACTIVE').length,
        important: announcements.filter(a => a.priority === 'IMPORTANT').length,
        forAll: announcements.filter(a => a.target.includes('ALL')).length
    };

    // Filter announcements based on search query and target role
    const filteredAnnouncements = useMemo(() => {
        return announcements.filter(announcement => {
            // Search filter - check ID, title, message, target, priority, status
            const searchLower = searchQuery.toLowerCase().trim();
            const matchesSearch = searchQuery === '' ||
                announcement.id.toString().includes(searchQuery) ||
                announcement.title.toLowerCase().includes(searchLower) ||
                announcement.message.toLowerCase().includes(searchLower) ||
                announcement.target.some(role => role.toLowerCase().includes(searchLower)) ||
                announcement.priority.toLowerCase().includes(searchLower) ||
                announcement.status.toLowerCase().includes(searchLower);

            // Role filter
            const matchesRole = targetRole === 'ALL' || announcement.target.includes(targetRole);

            return matchesSearch && matchesRole;
        });
    }, [announcements, searchQuery, targetRole]);

    const handleEdit = (id) => {
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            setEditingAnnouncement(announcement);
            setIsFormOpen(true);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            deleteAnnouncement(id);
            alert('Announcement deleted successfully!');
        }
    };

    const handleCreateAnnouncement = () => {
        setEditingAnnouncement(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (newAnnouncement) => {
        if (editingAnnouncement) {
            updateAnnouncement(editingAnnouncement.id, {
                title: newAnnouncement.title,
                message: newAnnouncement.message,
                target: newAnnouncement.targetRoles,
                priority: newAnnouncement.priority,
                status: newAnnouncement.status
            });
            alert('Announcement updated successfully!');
        } else {
            // Create new announcement with sequential ID
            const maxId = announcements.length > 0
                ? Math.max(...announcements.map(a => a.id))
                : 0;
            const newId = maxId + 1;

            const announcement = {
                id: newId,
                title: newAnnouncement.title,
                message: newAnnouncement.message,
                target: newAnnouncement.targetRoles,
                priority: newAnnouncement.priority,
                status: newAnnouncement.status,
                createdAt: newAnnouncement.createdAt
            };
            addAnnouncement(announcement);
            alert('Announcement created successfully!');
        }
        setEditingAnnouncement(null);
    };

    return (
        <AdminPortalLayout>
            <AnnouncementForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingAnnouncement(null);
                }}
                onSubmit={handleFormSubmit}
                editData={editingAnnouncement}
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
                        <div className="stat-content">
                            <div className="stat-label">Total Announcements</div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                        <div className="stat-icon-wrapper pink">
                            <img src={announcementIcon} alt="Announcements" className="stat-icon-img" />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-label">Active</div>
                            <div className="stat-value">{stats.active}</div>
                        </div>
                        <div className="stat-icon-wrapper green">
                            <img src={activeIcon} alt="Active" className="stat-icon-img" />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-label">Important</div>
                            <div className="stat-value">{stats.important}</div>
                        </div>
                        <div className="stat-icon-wrapper orange">
                            <img src={importantIcon} alt="Important" className="stat-icon-img" />
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-label">For All Users</div>
                            <div className="stat-value">{stats.forAll}</div>
                        </div>
                        <div className="stat-icon-wrapper blue">
                            <img src={allUsersIcon} alt="All Users" className="stat-icon-img" />
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
                            <option value="TECHNICIAN">TECHNICIAN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </div>

                {/* Announcements Table */}
                <div className="announcements-table-container">
                    {announcements.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No Announcements Yet</h3>
                            <p>Create your first announcement to notify users</p>
                            <button className="btn-create-announcement" onClick={handleCreateAnnouncement}>
                                Create Announcement
                            </button>
                        </div>
                    ) : filteredAnnouncements.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No Matching Announcements</h3>
                            <p>No announcements match your search criteria</p>
                            <button
                                className="btn-clear-search"
                                onClick={() => {
                                    setSearchQuery('');
                                    setTargetRole('ALL');
                                }}
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <>
                            {(searchQuery || targetRole !== 'ALL') && (
                                <div className="search-results-info">
                                    <span>Showing {filteredAnnouncements.length} of {announcements.length} announcements</span>
                                    <button
                                        className="btn-clear-search-small"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setTargetRole('ALL');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                            <table className="announcements-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '80px' }}>ID</th>
                                        <th style={{ width: '35%' }}>TITLE & MESSAGE</th>
                                        <th style={{ width: '15%' }}>TARGET</th>
                                        <th style={{ width: '12%' }}>PRIORITY</th>
                                        <th style={{ width: '12%' }}>STATUS</th>
                                        <th style={{ width: '15%' }}>CREATED</th>
                                        <th style={{ width: '11%' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAnnouncements.map((announcement) => (
                                        <tr key={announcement.id}>
                                            <td className="id-cell">
                                                <div className="id-wrapper">
                                                    #{announcement.id}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="announcement-title-cell">
                                                    <div className="announcement-title">{announcement.title}</div>
                                                    <div className="announcement-message">{announcement.message}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="target-roles">
                                                    {announcement.target.length === 1 && announcement.target[0] === 'ALL' ? (
                                                        <div className="role-badges">
                                                            <span className="role-badge all">ALL USERS</span>
                                                        </div>
                                                    ) : (
                                                        <div className="role-badges">
                                                            <div className="role-badge-list">
                                                                {announcement.target.map((role, idx) => (
                                                                    <span key={idx} className={`role-badge ${role.toLowerCase()}`}>
                                                                        {role}
                                                                    </span>
                                                                ))}
                                                            </div>
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
                                            <td className="created-date">
                                                <div className="date-wrapper">
                                                    {announcement.createdAt}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-action edit"
                                                        onClick={() => handleEdit(announcement.id)}
                                                        title="Edit announcement"
                                                    >
                                                        <img src={editIcon} alt="Edit" className="action-icon" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-action delete"
                                                        onClick={() => handleDelete(announcement.id)}
                                                        title="Delete announcement"
                                                    >
                                                        <img src={deleteIcon} alt="Delete" className="action-icon" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </AdminPortalLayout>
    );
}

export default ManageAnnouncementsPage;
