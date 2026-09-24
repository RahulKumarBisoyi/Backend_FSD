const API_URL = "/api/requests";

// DOM References
const form = document.getElementById("requestForm");
const requestIdInput = document.getElementById("requestId");
const studentNameInput = document.getElementById("studentName");
const emailInput = document.getElementById("email");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const requestsList = document.getElementById("requestsList");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const statTotal = document.getElementById("statTotal");
const statPending = document.getElementById("statPending");
const statHigh = document.getElementById("statHigh");
const countBadge = document.getElementById("countBadge");
const toast = document.getElementById("toast");

let allRequests = [];
let currentFilter = "all";
let searchQuery = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadRequests();
  setupFilterAndSearch();
});

// Toast notification helper
function showToast(message, type = "success") {
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  setTimeout(() => {
    toast.className = "toast hidden";
  }, 3200);
}

// Helper: Initials for avatar
function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper: Format Date
function formatDate(isoString) {
  if (!isoString) return "Recently";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper: Category Icons
function getCategoryIcon(category) {
  const map = {
    Academic: "🎓",
    Hostel: "🏢",
    Maintenance: "🛠️",
    Library: "📚",
    "IT Services": "💻",
    Other: "📌",
  };
  return map[category] || "📌";
}

// Update HUD Stats
function updateStats(requests) {
  const total = requests.length;
  const pending = requests.filter(r => (r.status || "Pending") === "Pending").length;
  const high = requests.filter(r => r.priority === "High").length;

  if (statTotal) statTotal.textContent = total;
  if (statPending) statPending.textContent = pending;
  if (statHigh) statHigh.textContent = high;
  if (countBadge) countBadge.textContent = `${total} Dispatches`;
}

// Filter and Search Setup
function setupFilterAndSearch() {
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });
}

function applyFilters() {
  let filtered = [...allRequests];

  // Priority Filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((r) => r.priority === currentFilter);
  }

  // Text Search
  if (searchQuery) {
    filtered = filtered.filter((r) =>
      (r.studentName && r.studentName.toLowerCase().includes(searchQuery)) ||
      (r.email && r.email.toLowerCase().includes(searchQuery)) ||
      (r.description && r.description.toLowerCase().includes(searchQuery)) ||
      (r.category && r.category.toLowerCase().includes(searchQuery)) ||
      (r.id && r.id.toLowerCase().includes(searchQuery))
    );
  }

  renderRequests(filtered);
}

// ---------- 1. GET ALL REQUESTS ----------
async function loadRequests() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch requests");
    allRequests = await res.json();
    updateStats(allRequests);
    applyFilters();
  } catch (err) {
    console.error("Error loading requests:", err);
    requestsList.innerHTML = `
      <div class="empty-hud">
        <div class="empty-icon">⚠️</div>
        <h3>SYSTEM OFFLINE</h3>
        <p>Could not load queue from campus backend. Please check connection.</p>
      </div>
    `;
  }
}

// ---------- RENDER REQUESTS FEED ----------
function renderRequests(requests) {
  if (!requests || requests.length === 0) {
    requestsList.innerHTML = `
      <div class="empty-hud">
        <div class="empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h3>NO ACTIVE DISPATCHES</h3>
        <p>${searchQuery || currentFilter !== "all" ? "No records match current filter criteria." : "Queue is clear. Submit a new ticket on the left console."}</p>
      </div>
    `;
    return;
  }

  requestsList.innerHTML = requests
    .map((r) => {
      const initials = getInitials(r.studentName);
      const icon = getCategoryIcon(r.category);
      const formattedDate = formatDate(r.createdAt);
      const statusText = r.status || "Pending";
      const shortId = r.id ? r.id.slice(-6) : "000000";

      return `
      <div class="ticket-card priority-card-${r.priority}">
        <!-- Top Bar: Ticket Monospace ID & Badges -->
        <div class="ticket-top">
          <div class="ticket-id-tag">
            <span>#TKT-${shortId}</span>
          </div>

          <div class="ticket-badges">
            <span class="badge badge-cat">${icon} ${escapeHtml(r.category)}</span>
            <span class="badge priority-${r.priority}">
              ${r.priority === "High" ? "CRITICAL" : r.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <!-- Student Profile Meta -->
        <div class="ticket-student">
          <div class="avatar-hex">${initials}</div>
          <div class="student-text">
            <h3>${escapeHtml(r.studentName)}</h3>
            <a href="mailto:${escapeHtml(r.email)}" class="student-email">
              ${escapeHtml(r.email)}
            </a>
          </div>
        </div>

        <!-- Incident Description -->
        <div class="ticket-desc-box">
          <p class="ticket-desc">${escapeHtml(r.description)}</p>
        </div>

        <!-- Ticket Footer & Action Controls -->
        <div class="ticket-footer">
          <div class="meta-status">
            <span class="status-indicator"></span>
            <span>${escapeHtml(statusText)} &bull; ${formattedDate}</span>
          </div>

          <div class="action-cluster">
            <!-- Download Text File Button -->
            <a href="/api/requests/${r.id}/download" class="btn-act btn-dl" download="Ticket-${r.id}.txt" title="Download Ticket Details as Text File">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Download .txt</span>
            </a>

            <!-- Edit Button -->
            <button class="btn-act btn-edit" onclick="editRequest('${r.id}')" title="Edit Dispatch">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </button>

            <!-- Delete Button -->
            <button class="btn-act btn-del" onclick="deleteRequest('${r.id}')" title="Delete Dispatch">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// Escape HTML for XSS prevention
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------- 2. SUBMIT / UPDATE (POST / PUT) ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const requestData = {
    studentName: studentNameInput.value.trim(),
    email: emailInput.value.trim(),
    category: categoryInput.value,
    description: descriptionInput.value.trim(),
    priority: priorityInput.value,
  };

  const id = requestIdInput.value;

  try {
    submitBtn.disabled = true;

    if (id) {
      // PUT /api/requests/:id
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) throw new Error("Update failed");
      showToast("Dispatch updated successfully! ⚡", "success");
    } else {
      // POST /api/requests
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) throw new Error("Submission failed");
      const created = await res.json();
      showToast(`Incident #${created.id.slice(-6)} logged! Download .txt available below.`, "success");
    }

    resetForm();
    await loadRequests();
  } catch (err) {
    console.error("Error transmitting request:", err);
    showToast("Transmission error. Please retry.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

// ---------- 3. EDIT (GET /api/requests/:id) ----------
async function editRequest(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Request not found");
    const r = await res.json();

    requestIdInput.value = r.id;
    studentNameInput.value = r.studentName;
    emailInput.value = r.email;
    categoryInput.value = r.category;
    descriptionInput.value = r.description;
    priorityInput.value = r.priority;

    if (formTitle) formTitle.textContent = "Modify Incident";
    if (formSubtitle) formSubtitle.textContent = `Editing dispatch ticket #TKT-${r.id.slice(-6)}`;
    submitBtn.querySelector("span").textContent = "COMMIT UPDATE";
    cancelEditBtn.classList.remove("hidden");

    form.scrollIntoView({ behavior: "smooth", block: "center" });
    studentNameInput.focus();
  } catch (err) {
    console.error("Error loading request:", err);
    showToast("Could not load request for editing.", "error");
  }
}

// ---------- 4. DELETE (DELETE /api/requests/:id) ----------
async function deleteRequest(id) {
  if (!confirm("Confirm deletion of this dispatch entry?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    showToast("Dispatch record purged! 🗑️", "success");
    loadRequests();
  } catch (err) {
    console.error("Error purging request:", err);
    showToast("Purge failed. Server error.", "error");
  }
}

// Cancel Edit Mode
cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  form.reset();
  requestIdInput.value = "";
  if (formTitle) formTitle.textContent = "Log New Incident";
  if (formSubtitle) formSubtitle.textContent = "Transmit a campus problem or request to the dispatch queue.";
  submitBtn.querySelector("span").textContent = "TRANSMIT DISPATCH";
  cancelEditBtn.classList.add("hidden");
}

// Global functions for inline actions
window.editRequest = editRequest;
window.deleteRequest = deleteRequest;