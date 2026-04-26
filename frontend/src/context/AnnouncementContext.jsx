import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AnnouncementContext = createContext();

const API_BASE_URL = 'http://localhost:8081/api/announcements';

export function AnnouncementProvider({ children }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch announcements from backend on initial load
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_BASE_URL);
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const addAnnouncement = async (announcement) => {
        try {
            const response = await axios.post(API_BASE_URL, announcement);
            setAnnouncements([response.data, ...announcements]);
            return response.data;
        } catch (error) {
            console.error('Error creating announcement:', error);
            throw error;
        }
    };

    const updateAnnouncement = async (id, updatedData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
            setAnnouncements(announcements.map(a =>
                a.id === id ? response.data : a
            ));
            return response.data;
        } catch (error) {
            console.error('Error updating announcement:', error);
            throw error;
        }
    };

    const deleteAnnouncement = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            setAnnouncements(announcements.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting announcement:', error);
            throw error;
        }
    };

    const getAnnouncementsForRole = (role) => {
        return announcements.filter(announcement =>
            announcement.status === 'ACTIVE' &&
            (announcement.target.includes('ALL') || announcement.target.includes(role))
        );
    };

    return (
        <AnnouncementContext.Provider value={{
            announcements,
            setAnnouncements,
            addAnnouncement,
            updateAnnouncement,
            deleteAnnouncement,
            getAnnouncementsForRole,
            loading,
            refreshAnnouncements: fetchAnnouncements
        }}>
            {children}
        </AnnouncementContext.Provider>
    );
}

export function useAnnouncements() {
    const context = useContext(AnnouncementContext);
    if (!context) {
        throw new Error('useAnnouncements must be used within AnnouncementProvider');
    }
    return context;
}
