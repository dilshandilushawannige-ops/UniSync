package com.smartcampus.unisync.announcement.service;

import com.smartcampus.unisync.announcement.dto.AnnouncementRequestDto;
import com.smartcampus.unisync.announcement.dto.AnnouncementResponseDto;
import com.smartcampus.unisync.announcement.entity.Announcement;
import com.smartcampus.unisync.announcement.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    @Transactional
    public AnnouncementResponseDto createAnnouncement(AnnouncementRequestDto requestDto) {
        Announcement announcement = new Announcement();
        announcement.setTitle(requestDto.getTitle());
        announcement.setMessage(requestDto.getMessage());
        announcement.setTarget(String.join(",", requestDto.getTargetRoles()));
        announcement.setPriority(requestDto.getPriority());
        announcement.setStatus(requestDto.getStatus());

        Announcement saved = announcementRepository.save(announcement);
        return mapToResponseDto(saved);
    }

    @Override
    public List<AnnouncementResponseDto> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementResponseDto getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));
        return mapToResponseDto(announcement);
    }

    @Override
    @Transactional
    public AnnouncementResponseDto updateAnnouncement(Long id, AnnouncementRequestDto requestDto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));

        announcement.setTitle(requestDto.getTitle());
        announcement.setMessage(requestDto.getMessage());
        announcement.setTarget(String.join(",", requestDto.getTargetRoles()));
        announcement.setPriority(requestDto.getPriority());
        announcement.setStatus(requestDto.getStatus());

        Announcement updated = announcementRepository.save(announcement);
        return mapToResponseDto(updated);
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Announcement not found with id: " + id);
        }
        announcementRepository.deleteById(id);
    }

    @Override
    public List<AnnouncementResponseDto> getAnnouncementsForRole(String role) {
        List<Announcement> announcements = announcementRepository.findAllByOrderByCreatedAtDesc();
        return announcements.stream()
                .filter(a -> a.getTarget().contains("ALL") || a.getTarget().contains(role))
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private AnnouncementResponseDto mapToResponseDto(Announcement announcement) {
        AnnouncementResponseDto dto = new AnnouncementResponseDto();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setMessage(announcement.getMessage());
        dto.setTarget(Arrays.asList(announcement.getTarget().split(",")));
        dto.setPriority(announcement.getPriority());
        dto.setStatus(announcement.getStatus());
        dto.setCreatedAt(announcement.getCreatedAt().format(FORMATTER));
        dto.setUpdatedAt(announcement.getUpdatedAt());
        return dto;
    }
}
