import { useState, useEffect } from 'react';
import './AnnouncementForm.css';

function AnnouncementForm({ isOpen, onClose, onSubmit, editData }) {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetRoles: [],
        priority: 'NORMAL',
        attachmentType: 'NONE',
        image: null,
        imagePreview: null
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title,
                message: editData.message,
                targetRoles: editData.target,
                priority: editData.priority,
                attachmentType: editData.attachmentType || 'NONE',
                image: editData.image || null,
                imagePreview: editData.image || null
            });
        } else {
            setFormData({
                title: '',
                message: '',
                targetRoles: [],
                priority: 'NORMAL',
                attachmentType: 'NONE',
                image: null,
                imagePreview: null
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
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
            priority: 'NORMAL',
            attachmentType: 'NONE',
            image: null,
            imagePreview: null
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="announcement-modal-overlay" onClick={handleClose}>
            <div className="announcement-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-announcement">
                    <div className="modal-header-content">
                        <h2 className="modal-title">{editData ? 'Update Announcement' : 'Create Announcement'}</h2>
                        <p className="modal-subtitle">Create and share important updates with your users</p>
                    </div>
                </div>

                <form id="announcement-form" onSubmit={handleSubmit} className="announcement-form">
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
                        <label>Attachment Type</label>
                        <select
                            name="attachmentType"
                            value={formData.attachmentType}
                            onChange={handleChange}
                            className="priority-select"
                        >
                            <option value="NONE">None</option>
                            <option value="IMAGE">Image</option>
                            <option value="DOCUMENT">Document</option>
                            <option value="LINK">Link</option>
                            <option value="VIDEO">Video</option>
                        </select>
                        <p className="role-hint">Select the type of attachment for this announcement.</p>
                    </div>

                    {formData.attachmentType === 'IMAGE' && (
                        <div className="form-group-announcement">
                            <label>Upload Image</label>
                            <div className="image-upload-container">
                                {formData.imagePreview ? (
                                    <div className="image-preview-wrapper">
                                        <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                                        <button
                                            type="button"
                                            className="btn-remove-image"
                                            onClick={handleRemoveImage}
                                        >
                                            ✕ Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="image-upload-box">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            onChange={handleImageChange}
                                            className="image-input"
                                        />
                                        <label htmlFor="image-upload" className="image-upload-label">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                            <span className="upload-text">Click to upload image</span>
                                            <span className="upload-hint">JPEG, PNG, GIF, or WebP (Max 5MB)</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
                                    checked={formData.targetRoles.includes('USER')}
                                    onChange={() => handleRoleToggle('USER')}
                                />
                                <span className="checkbox-text">STUDENTS</span>
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
                        <button type="button" className="btn-discard-announcement" onClick={handleClose}>
                            Discard
                        </button>
                        <button type="submit" className="btn-publish-announcement">
                            {editData ? 'Update Now' : 'Publish Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AnnouncementForm;
