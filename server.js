require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());
const ACCESS_KEY = process.env.ACCESS_KEY;
app.post("/photo", (req, res) => {
    const accessKey = req.headers["x-access-key"];
    if (accessKey !== ACCESS_KEY) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const base64_img = req.body.base64_img;
    if (!base64_img) {
        return res.status(400).json({
            success: false,
            message: "Base64 image is required"
        });
    }
    try {
        const imageBuffer = Buffer.from(base64_img, "base64");
        const filePath = path.join(__dirname,"img",`image-${Date.now()}.jpg`);
        fs.writeFileSync(filePath, imageBuffer);
        res.json({
            success: true,
            message: "Image saved successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to save image"
        });
    }
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});