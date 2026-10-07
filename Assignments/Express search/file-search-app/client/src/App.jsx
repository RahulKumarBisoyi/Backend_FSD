import { useState, useEffect } from "react";
import "./App.css";

// Helper: pick an emoji icon based on file extension
function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const icons = {
    txt: "📄",
    pdf: "📕",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    ppt: "📊",
    pptx: "📊",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    zip: "🗜️",
    mp4: "🎬",
    mp3: "🎵",
    js: "⚙️",
    json: "⚙️",
  };
  return icons[ext] || "📁";
}

function App() {
  // State: file list, search term, loading flag, error message
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/files";
  const DOWNLOAD_URL = "http://localhost:5000/api/download";

  // Fetch files from Express backend
  const fetchFiles = (query = "") => {
    setLoading(true);
    setError("");

    let requestUrl = API_URL;
    if (query && query.trim() !== "") {
      requestUrl = `${API_URL}?search=${encodeURIComponent(query.trim())}`;
    }

    fetch(requestUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to connect to server.");
        setLoading(false);
      });
  };

  // Load all files when the page opens
  useEffect(() => {
    fetchFiles();
  }, []);

  // Search files when button clicked or Enter pressed
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFiles(searchTerm);
  };

  // Clear search and show all files
  const handleClear = () => {
    setSearchTerm("");
    fetchFiles("");
  };

  // Download selected file
  const handleDownload = (filename) => {
    window.location.href = `${DOWNLOAD_URL}/${encodeURIComponent(filename)}`;
  };

  return (
    <div className="app-container">
      <div className="card">
        {/* Heading */}
        <h1 className="title">🗂️ File Search System</h1>
        <p className="subtitle">Search and download files from the server.</p>

        {/* Search Form (Enter key + button both work) */}
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-search">
            🔍 Search
          </button>
          <button type="button" className="btn btn-clear" onClick={handleClear}>
            ✖ Clear
          </button>
        </form>

        {/* Files Section */}
        <div className="files-section">
          <h2 className="section-title">Available Files</h2>

          {/* Loading indicator */}
          {loading && <p className="status-message">⏳ Loading files...</p>}

          {/* Error message */}
          {!loading && error && (
            <p className="status-message error-message">⚠️ {error}</p>
          )}

          {/* No files found */}
          {!loading && !error && files.length === 0 && (
            <p className="status-message">😕 No files found</p>
          )}

          {/* File list */}
          {!loading && !error && files.length > 0 && (
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-icon">{getFileIcon(file)}</span>
                    <span className="file-name">{file}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-download"
                    onClick={() => handleDownload(file)}
                  >
                    ⬇ Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
