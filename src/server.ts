import "dotenv/config";
import fs from "fs";
import path from "path";
import app from "./app";

const logFolder = path.join(__dirname, "..", "log");
const logFile = path.join(logFolder, "photo_api.log");

if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, { recursive: true });
}
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "");
}

if (!process.env.ACCESS_KEY) {
    console.warn("⚠️  WARNING: ACCESS_KEY environment variable is not defined in .env!");
}

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
    });
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));