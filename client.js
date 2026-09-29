const fs = require("fs");
async function uploadImage() {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = imageBuffer.toString("base64");
         const extension = path.extname(filePath).toLowerCase();

        const mimeTypes = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp"
        };

        const mimeType = mimeTypes[extension];

        if (!mimeType) {
            throw new Error("Unsupported image type");
        }

        const imageDataUrl = `data:${mimeType};base64,${base64Image}`;
        const response = await fetch("http://localhost:3000/photo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                image: imageDataUrl
            })
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}
uploadImage();