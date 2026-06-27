"use client";
import { Mahasiswa } from "@/lib/api";
import { getUser } from "@/lib/auth";

type Props = {
  mahasiswa: Mahasiswa[];
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function MahasiswaTable({ mahasiswa, onEdit, onDelete }: Props) {
  const user = getUser();
  const role = user?.role;

  // Cek otorisasi tombol aksi (Pertemuan 14)
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  if (mahasiswa.length === 0) {
    return <p>Belum ada data mahasiswa.</p>;
  }

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  return (
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Foto</th>
          <th>NIM</th>
          <th>Nama</th>
          <th>Prodi</th>
          <th>Angkatan</th>
          {(canEdit || canDelete) && <th>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {mahasiswa.map((item, index) => (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td>
              <img
                src={item.foto ? `${BACKEND_URL}/uploads/mahasiswa/${item.foto}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={item.nama}
                width={40}
                height={40}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </td>
            <td>{item.nim}</td>
            <td>{item.nama}</td>
            <td>{item.nama_prodi}</td>
            <td>{item.angkatan}</td>
            {(canEdit || canDelete) && (
              <td>
                <div className="actions">
                  {canEdit && (
                    <button className="btn-secondary" onClick={() => onEdit(item)}>Edit</button>
                  )}
                  {canDelete && (
                    <button className="btn-danger" onClick={() => onDelete(item.id)}>Hapus</button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}