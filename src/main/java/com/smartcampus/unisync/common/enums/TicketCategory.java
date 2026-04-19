package com.smartcampus.unisync.common.enums;

/**
 * Represents the category of the issue reported in a ticket.
 * Helps route and assign tickets to the right technician.
 */
public enum TicketCategory {
    ELECTRICAL,      // Issues related to electrical systems (lights, sockets, wiring)
    NETWORK,         // Network or internet connectivity issues
    PROJECTOR,       // Projector not working or damaged
    COMPUTER,        // Desktop or laptop hardware/software issues
    AIR_CONDITIONING, // AC unit not working or needs servicing
    FURNITURE,       // Broken or missing furniture (chairs, desks, boards)
    HARDWARE,        // Hardware-related issues
    SOFTWARE,        // Software-related issues
    FACILITY,        // Facility-related issues (building, rooms, etc.)
    OTHER            // Any issue that does not fit the above categories
}
