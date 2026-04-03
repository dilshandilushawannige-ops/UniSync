package com.smartcampus.unisync.common.enums;

/**
 * Represents the current lifecycle status of a ticket.
 */
public enum TicketStatus {
    OPEN,        // Newly submitted, not yet reviewed
    IN_PROGRESS, // Assigned to a technician and being worked on
    RESOLVED,    // Work is done and issue is fixed
    CLOSED,      // Ticket is closed after resolution
    REJECTED     // Ticket was rejected by admin
}
