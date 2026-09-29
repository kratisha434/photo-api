const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json({ limit: "10mb" }));
app.post("/photo", (req, res) => {
    const image = req.body.image;
    if (!image) {
        return res.status(400).json({
            success: false,
            message: "Image is required"
        });
    }
    try {
        let base64Image = image;
        let extension = "jpg";
        if (image.startsWith("data:image/")) {
            const parts = image.split(",");

            const imageInfo = parts[0];
            base64Image = parts[1];

            if (imageInfo.includes("image/jpeg")) {
                extension = "jpg";
            }
            else if (imageInfo.includes("image/png")) {
                extension = "png";
            }
            else if (imageInfo.includes("image/webp")) {
                extension = "webp";
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Unsupported image type"
                });
            }
        }
        const imageBuffer = Buffer.from(base64Image, "base64");
        const fileName = `image-${Date.now()}.${extension}`;
        const filePath = path.join(__dirname, "img", fileName);
        fs.writeFileSync(filePath, imageBuffer);
        return res.status(200).json({
            success: true,
            message: "Image saved successfully",
            fileName: fileName
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to save image"
        });
    }
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});