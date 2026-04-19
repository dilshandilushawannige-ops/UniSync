import { useState, useEffect } from 'react';
import './AnnouncementForm.css';

function AnnouncementForm({ isOpen, onClose, onSubmit, editData }) {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetRoles: [],
        priority: 'NORMAL'
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title,
                message: editData.message,
                targetRoles: editData.target,
                priority: editData.priority
            });
        } else {
            setFormData({
                title: '',
                message: '',
                targetRoles: [],
                priority: 'NORMAL'
            });
        }
    }, [editData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleToggle = (role) => {
        setFormData(prev => ({
            ...prev,
            targetRoles: prev.targetRoles.includes(role)
                ? prev.targetRoles.filter(r => r !== role)
                : [...prev.targetRoles, role]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.targetRoles.length === 0) {
            alert('Please select at least one target role');
            return;
        }
        onSubmit({
            ...formData,
            status: 'ACTIVE',
            createdAt: new Date().toLocaleString()
        });
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            title: '',
            message: '',
            targetRoles: [],
            priority: 'NORMAL'
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="announcement-modal-overlay" onClick={handleClose}>
            <div className="announcement-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-announcement">
                    <div className="modal-header-content">
                        <span className="modal-badge">ADMIN ANNOUNCEMENT CENTER</span>
                        <h2 className="modal-title">{editData ? 'Update Announcement' : 'Create Announcement'}</h2>
                        <p className="modal-subtitle">Send system-wide or role-based announcements to users through notifications.</p>
                    </div>
                    <button className="btn-close-announcement" onClick={handleClose}>
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="announcement-form">
                    <div className="form-group-announcement">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter announcement title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-announcement">
                        <label>Message</label>
                        <textarea
                            name="message"
                            placeholder="Write announcement message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group-announcement">
                        <label>Target Roles</label>
                        <div className="role-checkboxes-grid">
                            <label className="checkbox-label-announcement">
                                <input
                                    type="checkbox"
                                    checked={formData.targetRoles.includes('ALL')}
                                    onChange={() => handleRoleToggle('ALL')}
                                />
                                <span className="checkbox-text">ALL</span>
                            </label>
                            <label className="checkbox-label-announcement">
                                <input
                                    type="checkbox"
                                    checked={formData.targetRoles.includes('STUDENT')}
                                    onChange={() => handleRoleToggle('STUDENT')}
                                />
                                <span className="checkbox-text">STUDENT</span>
                            </label>
                            <label className="checkbox-label-announcement">
                                <input
                                    type="checkbox"
                                    checked={formData.targetRoles.includes('LECTURER')}
                                    onChange={() => handleRoleToggle('LECTURER')}
                                />
                                <span className="checkbox-text">LECTURER</span>
                            </label>
                            <label className="checkbox-label-announcement">
                                <input
                                    type="checkbox"
                                    checked={formData.targetRoles.includes('TECHNICIAN')}
                                    onChange={() => handleRoleToggle('TECHNICIAN')}
                                />
                                <span className="checkbox-text">TECHNICIAN</span>
                            </label>
                            <label className="checkbox-label-announcement">
                                <input
                                    type="checkbox"
                                    checked={formData.targetRoles.includes('MANAGER')}
                                    onChange={() => handleRoleToggle('MANAGER')}
                                />
                                <span className="checkbox-text">MANAGER</span>
                            </label>
                            <label className="checkbox-label-announcement">
                                <input
                                    type="checkbox"
                                    checked={formData.targetRoles.includes('ADMIN')}
                                    onChange={() => handleRoleToggle('ADMIN')}
                                />
                                <span className="checkbox-text">ADMIN</span>
                            </label>
                        </div>
                        <p className="role-hint">Select ALL to notify everyone, or choose multiple specific roles.</p>
                    </div>

                    <div className="form-group-announcement">
                        <label>Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="priority-select"
                        >
                            <option value="NORMAL">NORMAL</option>
                            <option value="IMPORTANT">IMPORTANT</option>
                        </select>
                    </div>

                    <div className="form-actions-announcement">
                        <button type="submit" className="btn-create-announcement-submit">
                            {editData ? 'Update Announcement' : 'Create Announcement'}
                        </button>
                        <button type="button" className="btn-cancel-announcement" onClick={handleClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AnnouncementForm;
