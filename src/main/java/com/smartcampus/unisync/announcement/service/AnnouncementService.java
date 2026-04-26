package com.smartcampus.unisync.announcement.service;

import com.smartcampus.unisync.announcement.dto.AnnouncementRequestDto;
import com.smartcampus.unisync.announcement.dto.AnnouncementResponseDto;

import java.util.List;

public interface AnnouncementService {

    // Create a new announcement
    AnnouncementResponseDto createAnnouncement(AnnouncementRequestDto requestDto);

    // Get all announcements
    List<AnnouncementResponseDto> getAllAnnouncements();

    // Get a single announcement by ID
    AnnouncementResponseDto getAnnouncementById(Long id);

    // Update an existing announcement
    AnnouncementResponseDto updateAnnouncement(Long id, AnnouncementRequestDto requestDto);

    // Delete an announcement
    void deleteAnnouncement(Long id);

    // Get announcements for a specific role
    List<AnnouncementResponseDto> getAnnouncementsForRole(String role);
}
