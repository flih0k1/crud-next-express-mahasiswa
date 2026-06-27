"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import { getUser, logout } from "@/lib/auth";
import {
  getMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [listProdi, setListProdi] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State Pengaman dari Hydration Mismatch
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // State untuk Fitur Search, Filter, dan Pagination
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(5); // Mengatur jumlah data per halaman

  // Logika Otorisasi berbasis State
  const role = currentUser?.role;
  const canModify = role === "admin" || role === "operator";

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });
      setMahasiswa(result.data);
      setTotalPage(result.meta.totalPage);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  // 1. Ambil data localStorage HANYA setelah komponen masuk ke browser client
  useEffect(() => {
    setIsMounted(true);
    const loggedInUser = getUser();
    if (!loggedInUser) {
      window.location.href = "/login";
      return;
    }
    setCurrentUser(loggedInUser);
  }, []);

  // 2. Trigger pemuatan data setelah komponen mounted dan user terverifikasi
  useEffect(() => {
    if (isMounted && currentUser) {
      loadMahasiswa();
    }
  }, [page, isMounted, currentUser]);

  useEffect(() => {
    if (isMounted) {
      getProdi().then(setListProdi).catch(console.error);
    }
  }, [isMounted]);

  const handleSearchTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset ke halaman pertama saat mencari data baru
    loadMahasiswa();
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setMessage("");
      setError("");
      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }
      setSelectedMahasiswa(null);
      setPage(1);
      await loadMahasiswa();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;
    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      setPage(1);
      await loadMahasiswa();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus data");
    }
  };

  // 3. Tampilkan loading transisi sejenak jika server & client belum sinkron
  if (!isMounted) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Menginisialisasi enkripsi sesi...</p>
      </div>
    );
  }

  return (
    <main className="container">
      {/* Bar Navigasi Profil Akun */}
      <div className="card" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          Selamat Datang, <strong>{currentUser?.name || "User"}</strong> ({role ? role.toUpperCase() : ""})
        </div>
        <button className="btn-danger" onClick={logout} style={{ padding: "6px 12px", fontSize: "13px" }}>
          Keluar Sistem (Logout)
        </button>
      </div>

      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Sistem Informasi Akademik terintegrasi dengan Relasi, Upload Foto, dan JWT Role Access.</p>
        </div>
        {role === "admin" && (
          <Link href="/users">
            <button className="btn-primary">🛡️ Kelola Users</button>
          </Link>
        )}
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {/* Form hanya muncul untuk Admin dan Operator */}
      {canModify ? (
        <MahasiswaForm
          selectedMahasiswa={selectedMahasiswa}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedMahasiswa(null)}
        />
      ) : (
        <div className="card" style={{ background: "#f3f4f6", color: "#6b7280", textAlign: "center" }}>
          ℹ️ Anda sedang login sebagai <strong>Viewer</strong>. Anda hanya diizinkan untuk memantau data tanpa hak akses manipulasi.
        </div>
      )}

      <section className="card" style={{ marginTop: 20 }}>
        {/* Panel Kontrol Penyaringan & Pencarian */}
        <form onSubmit={handleSearchTrigger} style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Cari NIM atau nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: "8px 12px" }}
          />
          <select value={prodiId} onChange={(e) => setProdiId(e.target.value)} style={{ padding: "8px 12px", width: "200px" }}>
            <option value="">Semua Prodi</option>
            {listProdi.map((p) => (
              <option key={p.id} value={p.id}>{p.nama_prodi}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary" style={{ padding: "9px 16px" }}>Cari</button>
        </form>

        {loading ? (
          <p>Memuat data dari database...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />

            {/* Navigasi Pagination */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" }}>
              <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                ◀️ Previous
              </button>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                Halaman {page} dari {totalPage}
              </span>
              <button className="btn-secondary" disabled={page >= totalPage} onClick={() => setPage(page + 1)}>
                Next ▶️
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}