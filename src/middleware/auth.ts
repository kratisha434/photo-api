import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export const validateAccessKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessKey = req.headers["x-access-key"];
    const expectedKey = process.env.ACCESS_KEY;

    if (!expectedKey) {
        return res.status(500).json({
            success: false,
            message: "Authentication misconfigured on server"
        });
    }

    if (
        typeof accessKey !== "string" ||
        accessKey.length !== expectedKey.length ||
        !crypto.timingSafeEqual(Buffer.from(accessKey), Buffer.from(expectedKey))
    ) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
};

export const logRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl || req.path,
        payload_size: req.headers["content-length"] || 0,
        ip: req.ip,
        user_agent: req.headers["user-agent"] || "Unknown"
    };

    const logFolder = path.join(__dirname, "..", "..", "log");
    const logFile = path.join(logFolder, "photo_api.log");

    // Asynchronous non-blocking file append to keep event loop responsive
    fs.appendFile(logFile, JSON.stringify(logData) + "\n").catch((err) => {
        console.error("Failed to append request log:", err.message);
    });

    next();
};