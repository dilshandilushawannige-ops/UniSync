import { useNavigate, useParams } from 'react-router-dom';
import AdminPortalLayout from '../../components/admin/AdminPortalLayout';
import AnnouncementForm from '../../components/announcement/AnnouncementForm';
import { useAnnouncements } from '../../context/AnnouncementContext';
import Swal from 'sweetalert2';

function EditAnnouncementPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { announcements, updateAnnouncement } = useAnnouncements();

    const announcement = announcements.find(a => a.id === parseInt(id));

    const handleFormSubmit = (updatedAnnouncement) => {
        try {
            updateAnnouncement(parseInt(id), {
                title: updatedAnnouncement.title,
                message: updatedAnnouncement.message,
                targetRoles: updatedAnnouncement.targetRoles,
                priority: updatedAnnouncement.priority,
                status: updatedAnnouncement.status,
                attachmentType: updatedAnnouncement.attachmentType,
                image: updatedAnnouncement.image
            });
            Swal.fire({
                title: 'Updated!',
                text: 'Announcement has been updated successfully.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/admin/announcements');
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Error updating announcement. Please try again.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            console.error('Error:', error);
        }
    };

    const handleClose = () => {
        navigate('/admin/announcements');
    };

    if (!announcement) {
        return (
            <AdminPortalLayout>
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <h2>Announcement not found</h2>
                    <button onClick={() => navigate('/admin/announcements')}>
                        Back to Announcements
                    </button>
                </div>
            </AdminPortalLayout>
        );
    }

    return (
        <AdminPortalLayout>
            <div style={{ padding: '24px' }}>
                <AnnouncementForm
                    isOpen={true}
                    onClose={handleClose}
                    onSubmit={handleFormSubmit}
                    editData={announcement}
                />
            </div>
        </AdminPortalLayout>
    );
}

export default EditAnnouncementPage;
