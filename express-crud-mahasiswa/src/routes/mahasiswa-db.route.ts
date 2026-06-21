import { Router, Request, Response } from "express";
import db from "../config/database";

const router = Router();

// 1. READ ALL FROM DATABASE (Sub-bab 4.7)
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM mahasiswa ORDER BY id DESC");
    res.json({
      message: "Data mahasiswa berhasil diambil dari database",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// 2. READ DETAIL WITH PARAMETER (Sub-bab 4.8)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await db.execute("SELECT * FROM mahasiswa WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    res.json({
      message: "Detail mahasiswa berhasil diambil",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// 3. CREATE DATA TO DATABASE (Sub-bab 4.9)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      return res.status(400).json({
        message: "NIM, nama, prodi, dan angkatan wajib diisi",
      });
    }

    const [result]: any = await db.execute(
      "INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)",
      [nim, nama, prodi, angkatan]
    );

    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan",
      data: {
        id: result.insertId,
        nim,
        nama,
        prodi,
        angkatan,
      },
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "NIM sudah digunakan",
      });
    }

    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// 4. UPDATE DATA MAHASISWA (PUT /api/db/mahasiswa/:id)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      return res.status(400).json({
        message: "NIM, nama, prodi, dan angkatan wajib diisi",
      });
    }

    // Menjalankan query SQL UPDATE manual dengan placeholder (?)
    const [result]: any = await db.execute(
      "UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?",
      [nim, nama, prodi, Number(angkatan), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    res.json({
      message: "Mahasiswa berhasil diperbarui",
      data: {
        id: Number(id),
        nim,
        nama,
        prodi,
        angkatan,
      },
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "NIM sudah digunakan" });
    }
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// 5. DELETE DATA MAHASISWA (DELETE /api/db/mahasiswa/:id)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Menjalankan query SQL DELETE manual
    const [result]: any = await db.execute("DELETE FROM mahasiswa WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    res.json({
      message: "Mahasiswa berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;