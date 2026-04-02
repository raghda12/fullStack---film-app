const API = "http://localhost:3000/movies";

let movies = [];
let activeId = null;

const listEl = document.getElementById("list");
const detailEl = document.getElementById("detail");
const toastEl = document.getElementById("toast");

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
  loadMovies();
  document.getElementById("openBtn").addEventListener("click", openModal);
});

// ── LOAD MOVIES ──
async function loadMovies() {
  listEl.innerHTML = '<div class="state-msg">Loading...</div>';
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();
    movies = await res.json();
    renderList();
  } catch {
    listEl.innerHTML =
      '<div class="state-msg state-error">Could not connect to server</div>';
  }
}

// ── RENDER LIST ──
function renderList() {
  if (movies.length === 0) {
    listEl.innerHTML = '<div class="state-msg">No movies yet</div>';
    return;
  }
  listEl.innerHTML = movies
    .map(
      (m) => `
    <div class="movie-item ${m.id === activeId ? "active" : ""}" data-id="${m.id}">
      <span class="movie-item-title">${m.title}</span>
      <span class="movie-item-sub">
        ${m.year ?? "—"}${m.rating != null ? " · ★ " + (+m.rating).toFixed(1) : ""}
      </span>
    </div>
  `,
    )
    .join("");

  listEl.querySelectorAll(".movie-item").forEach((item) => {
    item.addEventListener("click", () => selectMovie(+item.dataset.id));
  });
}

// ── SELECT MOVIE ──
async function selectMovie(id) {
  activeId = id;
  renderList();

  const cached = movies.find((m) => m.id === id);
  if (cached) showDetail(cached);

  try {
    const res = await fetch(API + "/movies/" + id);
    if (res.ok) {
      const data = await res.json();
      const idx = movies.findIndex((m) => m.id === id);
      if (idx !== -1) movies[idx] = data;
      showDetail(data);
    }
  } catch {}
}

// ── SHOW DETAIL ──
function showDetail(m) {
  const genres = Array.isArray(m.genre) ? m.genre : m.genre ? [m.genre] : [];

  detailEl.innerHTML = `
    <div>
      <h1 class="detail-title">${m.title}</h1>
      <div class="meta-row">
        ${m.year != null ? `<span class="badge">${m.year}</span>` : ""}
        ${m.rating != null ? `<span class="badge rating">★ ${(+m.rating).toFixed(1)}</span>` : ""}
        ${genres.map((g) => `<span class="badge">${g}</span>`).join("")}
        ${m.language && m.language !== "N/A" ? `<span class="badge">${m.language.toUpperCase()}</span>` : ""}
      </div>
      ${
        m.description
          ? `
        <p class="detail-label">Description</p>
        <p class="detail-desc">${m.description}</p>
      `
          : ""
      }
    </div>
  `;
}

// ── MODAL ──
function openModal() {
  const container = document.getElementById("modal-container");
  container.innerHTML = `
    <div class="modal-wrap" id="modalWrap">
      <div class="modal">
        <div class="modal-head">
          <span class="modal-head-title">Add movie</span>
          <button class="close-btn" id="closeBtn">✕</button>
        </div>
        <div class="form-group">
          <label>Title *</label>
          <input id="f-title" placeholder="e.g. Inception" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Year</label>
            <input id="f-year" type="number" placeholder="2024" />
          </div>
          <div class="form-group">
            <label>Rating</label>
            <input id="f-rating" type="number" placeholder="7.5" step="0.1" min="0" max="10" />
          </div>
        </div>
        <div class="form-group">
          <label>Genre</label>
          <input id="f-genre" placeholder="Action, Drama" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="f-desc" placeholder="Short synopsis..."></textarea>
        </div>
        <div class="form-err" id="f-err"></div>
        <button class="btn-submit" id="f-submit">Add movie</button>
      </div>
    </div>
  `;

  document.getElementById("closeBtn").addEventListener("click", closeModal);
  document.getElementById("modalWrap").addEventListener("click", (e) => {
    if (e.target.id === "modalWrap") closeModal();
  });
  document.getElementById("f-submit").addEventListener("click", submitMovie);
  document.getElementById("f-title").focus();
}

function closeModal() {
  document.getElementById("modal-container").innerHTML = "";
}

async function submitMovie() {
  const title = document.getElementById("f-title").value.trim();
  const year = document.getElementById("f-year").value;
  const rating = document.getElementById("f-rating").value;
  const genre = document.getElementById("f-genre").value.trim();
  const desc = document.getElementById("f-desc").value.trim();
  const errEl = document.getElementById("f-err");
  const btn = document.getElementById("f-submit");

  errEl.textContent = "";

  if (!title) {
    errEl.textContent = "Title is required.";
    return;
  }

  const body = { title };
  if (year) body.year = parseInt(year);
  if (rating) body.rating = parseFloat(rating);
  if (genre) body.genre = genre;
  if (desc) body.description = desc;

  btn.disabled = true;
  btn.textContent = "Adding...";

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      errEl.textContent = data.message || "Something went wrong.";
      btn.disabled = false;
      btn.textContent = "Add movie";
      return;
    }
    movies.push(data);
    renderList();
    closeModal();
    showToast("Movie added");
    selectMovie(data.id);
  } catch {
    errEl.textContent = "Cannot connect to server.";
    btn.disabled = false;
    btn.textContent = "Add movie";
  }
}

// ── TOAST ──
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2500);
}


