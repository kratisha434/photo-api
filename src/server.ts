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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});