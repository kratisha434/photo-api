const fs = require("fs");

const image = fs.readFileSync("test.jpg");

const base64Image = image.toString("base64");

console.log(base64Image);