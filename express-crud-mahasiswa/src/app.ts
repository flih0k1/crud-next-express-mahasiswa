import express from "express";
import cors from "cors";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";

const app = express();

// 1. UPDATE DI SINI: Mengatur CORS agar mengizinkan Frontend Next.js di port 3001
app.use(
  cors({
    origin: "http://localhost:3001", // Mengizinkan alamat frontend kamu
    methods: ["GET", "POST", "PUT", "DELETE"], // Method yang diperbolehkan
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json()); // Agar Express dapat membaca body JSON 

// === PASANG MIDDLEWARE LOGGER DI SINI (Sub-bab 3.8) ===
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Wajib dipanggil agar request tidak menggantung!
});

app.get("/", (req, res) => {
  res.json({ message: "Backend Express berjalan" });
});

// Daftarkan route dengan prefix path /api/mahasiswa 
app.use("/api/mahasiswa", mahasiswaRoutes);

// Route versi Database 
app.use("/api/db/mahasiswa", mahasiswaDbRoutes);

export default app;