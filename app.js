const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Create a storage engine that only accepts CSV files
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, callback) => {
    if (file.mimetype !== "text/csv") {
      return callback(new Error("Only CSV files are allowed."), "");
    }
    callback(null, file.originalname);
  },
});
// Configure multer for file uploads
const upload = multer({ storage });

// Serve static files from the public directory
app.use(express.static("public"));

// Define route to handle file upload
app.post("/upload", upload.array("csvFile", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const fileData = [];

  req.files.forEach((file) => {
    // Process the uploaded CSV file
    const results = [];
    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        fileData.push({ filename: file.originalname, data: results });
        fs.unlinkSync(file.path);

        if (fileData.length === req.files.length) {
          // Send the data with filenames in the response as JSON
          res.json(fileData);
        }
      });
  });
});

app.listen(port, () => {
  console.log(`Click here to launch: http://localhost:${port}`);
});
