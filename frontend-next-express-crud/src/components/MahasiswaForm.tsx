"use client";
import { FormEvent, useEffect, useState, useRef } from "react";
import { Mahasiswa, Prodi, getProdi } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancelEdit: () => void;
};

export default function MahasiswaForm({ selectedMahasiswa, onSubmit, onCancelEdit }: Props) {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [angkatan, setAngkatan] = useState(new Date().getFullYear().toString());
  const [listProdi, setListProdi] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Ambil daftar prodi dari database untuk dropdown
    getProdi().then(setListProdi).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedMahasiswa) {
      setNim(selectedMahasiswa.nim);
      setNama(selectedMahasiswa.nama);
      setProdiId(selectedMahasiswa.prodi_id.toString());
      setAngkatan(selectedMahasiswa.angkatan.toString());
    } else {
      setNim("");
      setNama("");
      setProdiId("");
      setAngkatan(new Date().getFullYear().toString());
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [selectedMahasiswa]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Bungkus semua data ke dalam FormData agar file foto bisa terkirim
    const formData = new FormData();
    formData.append("nim", nim);
    formData.append("nama", nama);
    formData.append("prodi_id", prodiId);
    formData.append("angkatan", angkatan);
    
    if (fileInputRef.current?.files?.[0]) {
      formData.append("foto", fileInputRef.current.files[0]);
    }

    try {
      await onSubmit(formData);
      if (!selectedMahasiswa) {
        setNim("");
        setNama("");
        setProdiId("");
        setAngkatan(new Date().getFullYear().toString());
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>
      <div className="grid">
        <div className="form-group">
          <label>NIM</label>
          <input value={nim} onChange={(e) => setNim(e.target.value)} placeholder="Contoh: 2201001" required />
        </div>
        <div className="form-group">
          <label>Nama</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama mahasiswa" required />
        </div>
        <div className="form-group">
          <label>Program Studi</label>
          <select value={prodiId} onChange={(e) => setProdiId(e.target.value)} required>
            <option value="">-- Pilih Prodi --</option>
            {listProdi.map((p) => (
              <option key={p.id} value={p.id}>{p.nama_prodi}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Angkatan</label>
          <input type="number" value={angkatan} onChange={(e) => setAngkatan(e.target.value)} required />
        </div>
        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label>Foto Mahasiswa (JPG/PNG, Max 2MB)</label>
          <input type="file" ref={fileInputRef} accept="image/*" />
        </div>
      </div>
      <div className="actions" style={{ marginTop: "15px" }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedMahasiswa ? "Update" : "Simpan"}
        </button>
        {selectedMahasiswa && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>Batal Edit</button>
        )}
      </div>
    </form>
  );
}