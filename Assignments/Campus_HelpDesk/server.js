import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "requests.json");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Helper function: Read requests from requests.json
async function readRequests() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, "[]", "utf-8");
      return [];
    }
    throw err;
  }
}

// Helper function: Write requests to requests.json
async function writeRequests(requests) {
  await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2), "utf-8");
}

// 1. GET /api/requests - Get all requests
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await readRequests();
    res.json(requests);
  } catch (err) {
    console.error("Error reading requests:", err);
    res.status(500).json({ error: "Failed to retrieve requests" });
  }
});

// Download all requests as a formatted text file
app.get("/api/requests/download", async (req, res) => {
  try {
    const requests = await readRequests();
    let text = "================================================================\n";
    text += "               CAMPUS HELP DESK - TICKET DISPATCH LOG           \n";
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Total Records: ${requests.length}\n`;
    text += "================================================================\n\n";

    if (requests.length === 0) {
      text += "No requests currently recorded in the system.\n";
    } else {
      requests.forEach((r, idx) => {
        text += `[#${idx + 1}] TICKET ID: ${r.id}\n`;
        text += `Student Name : ${r.studentName}\n`;
        text += `Email        : ${r.email}\n`;
        text += `Category     : ${r.category}\n`;
        text += `Priority     : ${r.priority}\n`;
        text += `Status       : ${r.status || "Pending"}\n`;
        text += `Submitted At : ${r.createdAt || "N/A"}\n`;
        if (r.updatedAt) text += `Updated At   : ${r.updatedAt}\n`;
        text += `Description  :\n${r.description}\n`;
        text += "----------------------------------------------------------------\n\n";
      });
    }

    text += "================================================================\n";
    text += "End of Report - Campus Help Desk Support System\n";
    text += "================================================================\n";

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="campus_requests_summary.txt"');
    res.send(text);
  } catch (err) {
    console.error("Error generating download file:", err);
    res.status(500).json({ error: "Failed to generate text file download" });
  }
});

// Download single request as a text file
app.get("/api/requests/:id/download", async (req, res) => {
  try {
    const requests = await readRequests();
    const request = requests.find((r) => String(r.id) === req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    let text = "================================================================\n";
    text += "            CAMPUS HELP DESK - OFFICIAL TICKET RECEIPT          \n";
    text += "================================================================\n\n";
    text += `Ticket ID    : #${request.id}\n`;
    text += `Student Name : ${request.studentName}\n`;
    text += `Email        : ${request.email}\n`;
    text += `Category     : ${request.category}\n`;
    text += `Priority     : ${request.priority}\n`;
    text += `Status       : ${request.status || "Pending"}\n`;
    text += `Created At   : ${request.createdAt || "N/A"}\n`;
    if (request.updatedAt) {
      text += `Last Updated : ${request.updatedAt}\n`;
    }
    text += "\n----------------------------------------------------------------\n";
    text += "PROBLEM DESCRIPTION:\n";
    text += "----------------------------------------------------------------\n";
    text += `${request.description}\n\n`;
    text += "================================================================\n";
    text += "Please present this receipt reference when following up with staff.\n";
    text += "================================================================\n";

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="Ticket-${request.id}.txt"`);
    res.send(text);
  } catch (err) {
    console.error("Error generating single request download:", err);
    res.status(500).json({ error: "Failed to generate request download" });
  }
});

// 2. GET /api/requests/:id - Get a single request by ID
app.get("/api/requests/:id", async (req, res) => {
  try {
    const requests = await readRequests();
    const request = requests.find((r) => String(r.id) === req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(request);
  } catch (err) {
    console.error("Error retrieving request:", err);
    res.status(500).json({ error: "Failed to retrieve request" });
  }
});

// 3. POST /api/requests - Submit a new request
app.post("/api/requests", async (req, res) => {
  try {
    const { studentName, email, category, description, priority } = req.body;

    if (!studentName || !email || !category || !description || !priority) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const requests = await readRequests();
    const newRequest = {
      id: Date.now().toString(),
      studentName: studentName.trim(),
      email: email.trim(),
      category,
      description: description.trim(),
      priority,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    await writeRequests(requests);

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ error: "Failed to create request" });
  }
});

// 4. PUT /api/requests/:id - Update an existing request
app.put("/api/requests/:id", async (req, res) => {
  try {
    const { studentName, email, category, description, priority, status } = req.body;
    const requests = await readRequests();
    const index = requests.findIndex((r) => String(r.id) === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    requests[index] = {
      ...requests[index],
      ...(studentName !== undefined && { studentName: studentName.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description: description.trim() }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      updatedAt: new Date().toISOString(),
    };

    await writeRequests(requests);
    res.json(requests[index]);
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: "Failed to update request" });
  }
});

// 5. DELETE /api/requests/:id - Delete a request
app.delete("/api/requests/:id", async (req, res) => {
  try {
    const requests = await readRequests();
    const index = requests.findIndex((r) => String(r.id) === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    const deletedRequest = requests.splice(index, 1)[0];
    await writeRequests(requests);

    res.json({ message: "Request deleted successfully", deletedRequest });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json({ error: "Failed to delete request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
