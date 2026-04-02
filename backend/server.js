const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const filePath = path.join(__dirname, "movies-db.json");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// read file
function readMovies() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// write file
function writeMovies(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// send response
function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    ...CORS_HEADERS,
  });
  res.end(JSON.stringify(data));
}

// mapping function
function mapMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : null,
    rating: movie.vote_average ?? null,
    description: movie.overview ?? "",
    genre: movie.genres ? movie.genres.split(", ") : [],
    language: movie.original_language ?? "N/A",
  };
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // handle preflight
  if (method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  // GET ALL
  if (method === "GET" && url === "/movies") {
    try {
      const movies = readMovies();
      const mapped = movies.map(mapMovie);
      return send(res, 200, mapped);
    } catch {
      return send(res, 500, { message: "Server error" });
    }
  }

  // GET ONE
  if (method === "GET" && url.startsWith("/movies/")) {
    const id = url.split("/")[2];
    const movies = readMovies();
    const movie = movies.find((m) => m.id == id);

    if (!movie) {
      return send(res, 404, { message: "Movie not found" });
    }

    return send(res, 200, mapMovie(movie));
  }

  // POST
  if (method === "POST" && url === "/movies") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        // validation
        if (!data.title) {
          return send(res, 400, { message: "Title is required" });
        }
        if (data.year && typeof data.year !== "number") {
          return send(res, 400, { message: "Year must be a number" });
        }
        if (data.rating && isNaN(data.rating)) {
          return send(res, 400, { message: "Rating must be a number" });
        }

        const movies = readMovies();

        const newMovie = {
          id: Date.now(),
          title: data.title,
          vote_average: data.rating || null,
          release_date: data.year ? `${data.year}-01-01` : null,
          overview: data.description || "",
          genres: data.genre || "",
          original_language: "en",
        };

        movies.push(newMovie);
        writeMovies(movies);

        return send(res, 201, mapMovie(newMovie));
      } catch {
        return send(res, 400, { message: "Invalid JSON" });
      }
    });

    return;
  }

  // 404
  send(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
