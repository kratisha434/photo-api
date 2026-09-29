const fs = require("fs");
async function uploadImage() {
    try {
        const imageBuffer = fs.readFileSync("test.jpg");
        const base64Image = imageBuffer.toString("base64");
        const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
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