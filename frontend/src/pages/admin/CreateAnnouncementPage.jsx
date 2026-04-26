import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPortalLayout from '../../components/admin/AdminPortalLayout';
import AnnouncementForm from '../../components/announcement/AnnouncementForm';
import { createAnnouncement } from '../../services/announcementService';
import Swal from 'sweetalert2';

function CreateAnnouncementPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (newAnnouncement) => {
        setIsSubmitting(true);
        try {
            await createAnnouncement({
                title: newAnnouncement.title,
                message: newAnnouncement.message,
                targetRoles: newAnnouncement.targetRoles,
                priority: newAnnouncement.priority,
                status: newAnnouncement.status || 'ACTIVE'
            });
            
            await Swal.fire({
                title: 'Created!',
                text: 'Announcement has been created and notifications sent to users.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/admin/announcements');
        } catch (error) {
            await Swal.fire({
                title: 'Error!',
                text: error?.response?.data?.message || 'Error creating announcement. Please try again.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        navigate('/admin/announcements');
    };

    return (
        <AdminPortalLayout>
            <div style={{ padding: '24px' }}>
                {isSubmitting ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Creating announcement and sending notifications...</p>
                    </div>
                ) : (
                    <AnnouncementForm
                        isOpen={true}
                        onClose={handleClose}
                        onSubmit={handleFormSubmit}
                        editData={null}
                    />
                )}
            </div>
        </AdminPortalLayout>
    );
}

export default CreateAnnouncementPage;
