// Custom error class for consistent API errors
export class AppError extends Error {
    status: number;              // HTTP status code
    code: string | undefined;    // Custom error code
    details: unknown;            // Extra error context/details

    constructor(status: number, message: string, code?: string, details?: unknown) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype); // ensure instanceof works
    }

    // Predefined helpers for common HTTP errors
    static badRequest(msg = "Bad Request", details?: unknown) {
        return new AppError(400, msg, "BAD_REQUEST", details);
    }
    static unauthorized(msg = "Unauthorized") {
        return new AppError(401, msg, "UNAUTHORIZED");
    }
    static forbidden(msg = "Forbidden") {
        return new AppError(403, msg, "FORBIDDEN");
    }
    static notFound(msg = "Not Found") {
        return new AppError(404, msg, "NOT_FOUND");
    }
    static conflict(msg = "Conflict") {
        return new AppError(409, msg, "CONFLICT");
    }
    static internal(msg = "Internal Server Error", details?: unknown) {
        return new AppError(500, msg, "INTERNAL", details);
    }
}
