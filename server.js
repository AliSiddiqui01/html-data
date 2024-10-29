// server.js
const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use(express.static("public"));

app.post("/upload", upload.single("dataset"), (req, res) => {
    const inputFilePath = path.join(__dirname, req.file.path);
    const outputFilePath = path.join(__dirname, "uploads", "cleaned_dataset.csv");

    const pythonProcess = spawn("python3", ["cleaning.py", inputFilePath, outputFilePath]);

    pythonProcess.stdout.on("data", (data) => {
        console.log(`Python output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            res.status(500).send("Error processing the file.");
            return;
        }

        res.download(outputFilePath, "cleaned_dataset.csv", (err) => {
            if (err) {
                res.status(500).send("Error downloading the file.");
            }

            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
