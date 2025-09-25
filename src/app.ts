// src/app.ts
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { AppError } from "./core/errors.js";
import { logger } from "./logger/logger.js";
import { env } from "./config/env.js";

const app = express();

app.use(
    cors({
        origin: (origin: any, callback: any) => {
            if (!origin || env.allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }));

// routes
app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404
app.use((_req, _res, next) => next(AppError.notFound("Route not found")));

// error handler
app.use((err: unknown, _req: any, res: any, _next: any) => {
    if (err instanceof AppError) {
        logger.warn("HandledError", { status: err.status, code: err.code, msg: err.message });
        return res.status(err.status).json({ ok: false, error: { message: err.message, code: err.code } });
    }
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error("UnhandledError", { msg });
    return res.status(500).json({ ok: false, error: { message: "Internal Server Error" } });
});

export default app;
