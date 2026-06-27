import express from "express";
import cors from "cors";
import path from "path";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import prodiRoutes from "./routes/prodi.route";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Expose folder uploads agar foto mahasiswa bisa dipanggil via URL browser
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Daftarkan API Endpoint
app.use("/api/auth", authRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/users", userRoutes);

export default app;