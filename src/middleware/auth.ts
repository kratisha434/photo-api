import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const allowedMethod = "POST";
    const allowedPath = "/photo";
    if (req.method !== allowedMethod || req.path !== allowedPath) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        });
    }
    next();
};
export const validateAccessKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessKey = req.headers["x-access-key"];
    const expectedKey = process.env.ACCESS_KEY;
    if (!accessKey || accessKey !== expectedKey) {
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
        method: req.method,
        payload_size: req.headers["content-length"] || 0,
        ip: req.ip,
        user_agent: req.headers["user-agent"] || "Unknown"
    };
    const logFolder = path.join(__dirname, "..", "..", "log");
    const logFile = path.join(logFolder, "photo_api.log");
    if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder, { recursive: true });
    }
    fs.appendFileSync(
        logFile,
        JSON.stringify(logData) + "\n"
    );
    next();
};