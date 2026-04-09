package com.smartcampus.unisync.common.exception;

/**
 * Custom exception thrown when the request contains invalid or missing data.
 * For example: trying to upload a wrong file type, or sending empty fields.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
