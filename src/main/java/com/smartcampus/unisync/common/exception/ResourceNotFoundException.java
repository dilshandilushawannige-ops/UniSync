package com.smartcampus.unisync.common.exception;

/**
 * Custom exception thrown when a requested resource (ticket, user, etc.) is not found in the database.
 * Extends RuntimeException so we don't need to declare it in method signatures.
 */
public class ResourceNotFoundException extends RuntimeException {

    // Constructor that accepts a message explaining what was not found
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
