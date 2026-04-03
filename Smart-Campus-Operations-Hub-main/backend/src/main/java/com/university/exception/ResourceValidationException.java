package com.university.exception;

/**
 * Exception thrown when resource validation fails
 */
public class ResourceValidationException extends RuntimeException {
    public ResourceValidationException(String message) {
        super(message);
    }
}
