import { useNavigate } from 'react-router-dom';
import AdminPortalLayout from '../../components/admin/AdminPortalLayout';
import AnnouncementForm from '../../components/announcement/AnnouncementForm';
import { useAnnouncements } from '../../context/AnnouncementContext';
import Swal from 'sweetalert2';

function CreateAnnouncementPage() {
    const navigate = useNavigate();
    const { addAnnouncement } = useAnnouncements();

    const handleFormSubmit = (newAnnouncement) => {
        try {
            addAnnouncement({
                title: newAnnouncement.title,
                message: newAnnouncement.message,
                targetRoles: newAnnouncement.targetRoles,
                priority: newAnnouncement.priority,
                status: newAnnouncement.status,
                attachmentType: newAnnouncement.attachmentType,
                image: newAnnouncement.image
            });
            Swal.fire({
                title: 'Created!',
                text: 'Announcement has been created successfully.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/admin/announcements');
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Error saving announcement. Please try again.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            console.error('Error:', error);
        }
    };

    const handleClose = () => {
        navigate('/admin/announcements');
    };

    return (
        <AdminPortalLayout>
            <div style={{ padding: '24px' }}>
                <AnnouncementForm
                    isOpen={true}
                    onClose={handleClose}
                    onSubmit={handleFormSubmit}
                    editData={null}
                />
            </div>
        </AdminPortalLayout>
    );
}

export default CreateAnnouncementPage;
