import { getToken } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
};

// Interface untuk data dropdown Prodi
export type Prodi = {
  id: number;
  nama_prodi: string;
};

// 1. Ambil Data Mahasiswa dengan Search, Filter, & Pagination
export async function getMahasiswa(params: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}) {
  const token = getToken();
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal mengambil data");
  return result;
}

// 2. Ambil Semua Data Prodi untuk Dropdown
export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data || [];
}

// 3. Create Mahasiswa menggunakan FormData (Mendukung File)
export async function createMahasiswa(formData: FormData) {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Jangan set Content-Type header jika menggunakan FormData
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

// 4. Update Mahasiswa menggunakan FormData (Mendukung File)
export async function updateMahasiswa(id: number, formData: FormData) {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

// 5. Delete Mahasiswa
export async function deleteMahasiswa(id: number): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
}