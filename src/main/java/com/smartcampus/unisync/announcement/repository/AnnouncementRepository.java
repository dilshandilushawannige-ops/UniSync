package com.smartcampus.unisync.announcement.repository;

import com.smartcampus.unisync.announcement.entity.Announcement;
import com.smartcampus.unisync.common.enums.AnnouncementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // Find all announcements by status
    List<Announcement> findByStatus(AnnouncementStatus status);

    // Find announcements containing a specific role in target
    List<Announcement> findByTargetContaining(String role);

    // Find all announcements ordered by creation date (newest first)
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
