import { createContext, useContext, useState, useEffect } from 'react';

const AnnouncementContext = createContext();

export function AnnouncementProvider({ children }) {
    const [announcements, setAnnouncements] = useState(() => {
        // Load announcements from localStorage on initial load
        const saved = localStorage.getItem('announcements');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever announcements change
    useEffect(() => {
        localStorage.setItem('announcements', JSON.stringify(announcements));
    }, [announcements]);

    const addAnnouncement = (announcement) => {
        setAnnouncements([announcement, ...announcements]);
    };

    const updateAnnouncement = (id, updatedData) => {
        setAnnouncements(announcements.map(a =>
            a.id === id ? { ...a, ...updatedData } : a
        ));
    };

    const deleteAnnouncement = (id) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
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
            getAnnouncementsForRole
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
