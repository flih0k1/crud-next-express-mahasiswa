import { Router } from "express";
import { 
  getAllMahasiswa, 
  createMahasiswa, 
  updateMahasiswa, 
  deleteMahasiswa 
} from "../controllers/mahasiswa.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";

const router = Router();

// 1. READ ALL WITH JOIN, SEARCH, FILTER, PAGINATION (Bisa diakses Admin, Operator, Viewer)
router.get("/", authMiddleware, allowRoles("admin", "operator", "viewer"), getAllMahasiswa);

// 2. CREATE MAHASISWA WITH FOTO UPLOAD (Hanya Admin & Operator)
router.post("/", authMiddleware, allowRoles("admin", "operator"), uploadFotoMahasiswa.single("foto"), createMahasiswa);

// 3. UPDATE MAHASISWA WITH FOTO UPLOAD (Hanya Admin & Operator)
router.put("/:id", authMiddleware, allowRoles("admin", "operator"), uploadFotoMahasiswa.single("foto"), updateMahasiswa);

// 4. DELETE MAHASISWA FROM DATABASE (Hanya Admin yang Berhak)
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteMahasiswa);

export default router;