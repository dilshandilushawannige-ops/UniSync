package com.smartcampus.unisync.announcement.controller;

import com.smartcampus.unisync.announcement.dto.AnnouncementRequestDto;
import com.smartcampus.unisync.announcement.dto.AnnouncementResponseDto;
import com.smartcampus.unisync.announcement.service.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    public ResponseEntity<AnnouncementResponseDto> createAnnouncement(
            @Valid @RequestBody AnnouncementRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(announcementService.createAnnouncement(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementResponseDto>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementResponseDto> getAnnouncementById(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.getAnnouncementById(id));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<AnnouncementResponseDto>> getAnnouncementsForRole(@PathVariable String role) {
        return ResponseEntity.ok(announcementService.getAnnouncementsForRole(role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementResponseDto> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementRequestDto requestDto) {
        return ResponseEntity.ok(announcementService.updateAnnouncement(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}
