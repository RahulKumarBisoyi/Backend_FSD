// 1. Import required Node.js modules and packages
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// 2. Create Express application
const app = express();

// 3. Configure middleware
app.use(cors());
app.use(express.json());

// 4. Define the path to the files directory
const filesFolder = path.join(__dirname, "files");

// API 1: Get all files or search files by keyword
app.get("/api/files", (req, res) => {
  // Read files from folder
  fs.readdir(filesFolder, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return res.status(500).json({ error: "Unable to read files from server" });
    }

    // Get search query from request URL (e.g. ?search=react)
    const searchQuery = req.query.search;

    // Search files if query parameter is provided
    if (searchQuery && searchQuery.trim() !== "") {
      const keyword = searchQuery.toLowerCase().trim();
      const filteredFiles = files.filter((file) =>
        file.toLowerCase().includes(keyword)
      );
      return res.json(filteredFiles);
    }

    // Return all files if no search query is provided
    res.json(files);
  });
});

// API 2: Download selected file
app.get("/api/download/:filename", (req, res) => {
  // Prevent path traversal by extracting only the base filename
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(filesFolder, safeFilename);

  // Check if the requested file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  // Download selected file using Express res.download()
  res.download(filePath, safeFilename, (err) => {
    if (err) {
      console.error("Download error:", err);
      if (!res.headersSent) {
        res.status(500).send("Error downloading file");
      }
    }
  });
});

// Start Express server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
