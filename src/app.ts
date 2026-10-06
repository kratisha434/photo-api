import express from "express";
import fs from "fs";
import path from "path";
import {
    validateRequest,
    validateAccessKey,
    logRequest
} from "./middleware/auth";
const app = express();
app.use(express.json());
app.use(logRequest);
app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "OK"
    });
});
app.use(validateRequest);
app.post("/photo", validateAccessKey, (req, res) => {
    const base64_img = req.body.base64_img;
    if (!base64_img) {
        return res.status(400).json({
            success: false,
            message: "Base64 image is required"
        });
    }
    try {
        const imageBuffer = Buffer.from(base64_img, "base64");
        const fileName = `image-${Date.now()}.jpg`;
        const imgFolder = path.join(__dirname, "..", "img");
        if (!fs.existsSync(imgFolder)) {
            fs.mkdirSync(imgFolder, { recursive: true });
        }
        const filePath = path.join(imgFolder, fileName);
        fs.writeFileSync(filePath, imageBuffer);
        return res.status(200).json({
            success: true,
            message: "Image saved successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to save image"
        });
    }
});
export default app;