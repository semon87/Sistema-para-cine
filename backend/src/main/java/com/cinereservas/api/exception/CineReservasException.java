package com.cinereservas.api.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CineReservasException extends RuntimeException {

    private final HttpStatus httpStatus;

    public CineReservasException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public static CineReservasException notFound(String message) {
        return new CineReservasException(message, HttpStatus.NOT_FOUND);
    }

    public static CineReservasException badRequest(String message) {
        return new CineReservasException(message, HttpStatus.BAD_REQUEST);
    }

    public static CineReservasException conflict(String message) {
        return new CineReservasException(message, HttpStatus.CONFLICT);
    }

    public static CineReservasException forbidden(String message) {
        return new CineReservasException(message, HttpStatus.FORBIDDEN);
    }
}