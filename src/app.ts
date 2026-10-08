import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import {
    validateAccessKey,
    logRequest
} from "./middleware/auth";

const app = express();

// Set appropriate JSON body limit for image payloads (default is 100kb which breaks photo uploads)
app.use(express.json({ limit: "15mb" }));
app.use(logRequest);

app.get("/health", (_req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        message: "OK"
    });
});

/**
 * Validates magic numbers to verify image MIME type and prevent malicious arbitrary file uploads.
 */
function getImageExtension(buffer: Buffer): string | null {
    if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return "jpg";
    }
    if (
        buffer.length >= 4 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
    ) {
        return "png";
    }
    if (
        buffer.length >= 12 &&
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
        return "webp";
    }
    return null;
}

app.post("/photo", validateAccessKey, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawBase64 = req.body?.base64_img;
        if (!rawBase64 || typeof rawBase64 !== "string") {
            return res.status(400).json({
                success: false,
                message: "Base64 image is required and must be a string"
            });
        }

        // Strip data URI prefix if present (e.g. data:image/jpeg;base64,...)
        const cleanBase64 = rawBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(cleanBase64, "base64");

        if (imageBuffer.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty base64 image data"
            });
        }

        const extension = getImageExtension(imageBuffer);
        if (!extension) {
            return res.status(400).json({
                success: false,
                message: "Invalid image format. Supported formats: JPEG, PNG, WEBP"
            });
        }

        const fileName = `image-${Date.now()}-${crypto.randomUUID()}.${extension}`;
        const imgFolder = path.join(__dirname, "..", "img");

        await fs.mkdir(imgFolder, { recursive: true });
        const filePath = path.join(imgFolder, fileName);
        await fs.writeFile(filePath, imageBuffer);

        return res.status(200).json({
            success: true,
            message: "Image saved successfully",
            fileName
        });
    } catch (error) {
        next(error);
    }
});

// Standard 404 handler
app.use((_req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Internal Server Error:", err);
    const status = err.status || err.statusCode || 500;
    return res.status(status).json({
        success: false,
        message: status === 500 ? "Internal server error" : err.message
    });
});

export default app;