# 🎬 Movie App  
**Full-Stack Diagnostic Assignment**  
Node.js Backend • Vanilla JS Frontend • JSON File Storage  

---

## 🚀 1. How to Run the Project  

### ✅ Prerequisites  
- Node.js (v14 or higher)  
- A web browser (Chrome, Firefox, etc.)  
- Git  

---

### 📥 Step 1 — Clone the Repository  
```bash
git clone <your-repo-url>
cd movie-app
```

---

### ▶️ Step 2 — Start the Backend  
```bash
cd backend
node server.js
```

Server will run at:  
👉 http://localhost:3000/movies 

---

### 🌐 Step 3 — Open the Frontend  

You have two options:

**Option 1:**  
- Open `index.html` directly in your browser  

**Option 2 (Recommended):**  
```bash
cd frontend
npx serve .
```

Then open:  
👉 http://localhost:3000/movies  

> ⚠️ Make sure the backend is running before using the app.

---

## 📁 Project Structure  

```bash
movie-app/
│
├── backend/
│   ├── server.js          
│   └── movies-db.json     
│
├── frontend/
│   ├── index.html         
│   ├── style.css          
│   └── script.js             
│
└── README.md
```

---

## 🔗 2. API Endpoints  

**Base URL:**  
```
http://localhost:3000
```

| Method | Endpoint        | Description |
|--------|---------------|------------|
| GET    | /movies        | Get all movies |
| GET    | /movies/:id    | Get movie by ID |
| POST   | /movies        | Add a new movie |

---

## 📝 3. Example Request Body  

### ➕ POST `/movies`  

**Minimum Required:**
```json
{
  "title": "Inception"
}
```

**Full Example:**
```json
{
  "title": "Inception",
  "year": 2010,
  "rating": 8.8,
  "genre": "Action, Sci-Fi",
  "description": "A thief who steals corporate secrets..."
}
```

---

### ✅ Validation Rules  

- title — required (string)  
- year — optional (number)  
- rating — optional (0–10 number)  
- genre — optional (string)  
- description — optional (string)  

---

### 📤 Example Response (201 Created)  
```json
{
  "id": 1719432000000,
  "title": "Inception",
  "year": 2010,
  "rating": 8.8,
  "genre": ["Action", "Sci-Fi"],
  "description": "A thief who steals corporate secrets...",
  "language": "en"
}
```

---

## 💡 4. Assumptions  

- movies-db.json must exist before running the server  
- Genres are stored as a comma-separated string and converted to an array  
- IDs are generated using Date.now()  
- Backend and frontend run on different origins → CORS required

---

## ⚠️ 5. Known Limitations  

- No DELETE endpoint  
- No PATCH endpoint  
- No search/filter functionality  
- Uses synchronous file I/O  
- No real database (JSON file only)  
- No advanced input validation  
- No unified dev server  
- No movie poster support  

---

## 📊 6. Progress  

### ✅ Completed  

- Node.js HTTP server (no frameworks)  
- GET /movies  
- GET /movies/:id  
- POST /movies  
- CORS handling  
- Frontend movie list display  
- Movie details view  
- Add movie form with validation  
- Loading / error / empty states  
- Responsive design  
- Two UI styles  

---

### ❌ Not Completed  

- DELETE /movies/:id  
- PATCH /movies/:id  
- Search endpoint  
- IMDb poster integration  

---

## 🧠 7. Challenges Faced  

- CORS issues and preflight handling  
- Data mapping between backend and frontend  
- Managing state with Vanilla JS  

---

## ✨ Final Notes  

This project demonstrates building a full-stack app from scratch without frameworks, focusing on:

- HTTP server creation  
- REST API design  
- File-based data storage  
- Frontend data fetching  
- State management using Vanilla JavaScript  
