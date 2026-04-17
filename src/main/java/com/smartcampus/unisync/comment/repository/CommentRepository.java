package com.smartcampus.unisync.comment.repository;

import com.smartcampus.unisync.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Comment entity.
 * JpaRepository gives us built-in methods like:
 * save(), findById(), findAll(), deleteById() — no need to write them.
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments that belong to a specific ticket
    // Spring reads the method name and builds the SQL query automatically
    List<Comment> findByTicketId(Long ticketId);
}
