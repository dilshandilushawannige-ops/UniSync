package com.smartcampus.unisync.common.enums;

/**
 * Represents the current status (lifecycle stage) of a ticket.
 */
public enum TicketStatus {
    OPEN,        // Ticket has been submitted and is waiting to be reviewed
    IN_PROGRESS, // A technician has been assigned and is working on it
    RESOLVED,    // The issue has been fixed
    CLOSED,      // Ticket is fully closed after resolution
    REJECTED     // Ticket was reviewed and rejected by admin
}
