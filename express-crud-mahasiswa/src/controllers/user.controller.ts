import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/database";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
    res.json({ message: "Data user berhasil diambil", data: rows });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: "Semua field wajib diisi" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role]);
    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    await db.query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id]);
    res.json({ message: "User berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const resetPasswordByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
    res.json({ message: "Password berhasil direset oleh Admin", temporaryPassword: tempPassword });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};