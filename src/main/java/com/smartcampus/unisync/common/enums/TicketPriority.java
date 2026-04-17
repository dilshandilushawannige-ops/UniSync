package com.smartcampus.unisync.common.enums;

/**
 * Priority level of the ticket, used to determine urgency of resolution.
 */
public enum TicketPriority {
    LOW,    // Can be handled when time permits
    MEDIUM, // Should be handled soon
    HIGH,   // Urgent — needs quick attention
    URGENT  // Critical — must be handled immediately
}
