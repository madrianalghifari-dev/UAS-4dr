"use client";

import { useState } from "react";
import { Service } from "@prisma/client";
import { Plus, Search, Edit2, Trash2, X, ChevronDown } from "lucide-react";
import { createService, updateService, deleteService } from "./actions";
import Link from "next/link";

export function ServiceClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama_layanan: "",
    satuan: "kg",
    harga: 0,
    estimasi_hari: 2,
    is_active: true,
  });

  const filteredServices = services.filter((s) =>
    s.nama_layanan.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        nama_layanan: service.nama_layanan,
        satuan: service.satuan,
        harga: service.harga,
        estimasi_hari: service.estimasi_hari,
        is_active: service.is_active,
      });
    } else {
      setEditingService(null);
      setFormData({ nama_layanan: "", satuan: "kg", harga: 0, estimasi_hari: 2, is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      await updateService(editingService.id, formData);
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...s, ...formData } : s))
      );
    } else {
      await createService(formData);
      window.location.reload();
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      setIsDeleting(id);
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 h-[calc(100vh-80px)] overflow-hidden gap-6 bg-slate-50">
      {/* Top Banner (setengahnya gambar) */}
      <div className="relative rounded-3xl overflow-hidden shrink-0 h-48 sm:h-64 shadow-sm">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-services.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Layanan & Harga</h1>
          <p className="text-white/90 max-w-xl text-sm sm:text-base">Atur jenis layanan cuci, harga per satuan, dan estimasi waktu selesai untuk memudahkan operasional.</p>
        </div>
      </div>

      {/* Bottom Box (setengahnya kotak) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        {/* Header Actions */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-[0_4px_16px_rgba(15,252,190,0.3)] transform hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Tambah Layanan
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 shadow-sm">
              <tr className="text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Layanan</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Estimasi (Hari)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium text-lg">Tidak ada data layanan.</p>
                      <p className="text-slate-400 text-sm">Coba cari dengan kata kunci lain atau tambah baru.</p>
                    </div>
                  </td>
                </tr>
            ) : (
              filteredServices.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                  <td className="p-4 font-medium text-slate-800">
                    {service.nama_layanan}
                  </td>
                  <td className="p-4 text-slate-600">
                    Rp {service.harga.toLocaleString("id-ID")} / {service.satuan}
                  </td>
                  <td className="p-4 text-slate-600">
                    {service.estimasi_hari} Hari
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        service.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {service.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={isDeleting === service.id}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/50">
              <h2 className="text-xl font-bold text-text-main">
                {editingService ? "Edit Layanan" : "Tambah Layanan"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">
                  Nama Layanan
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_layanan}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_layanan: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-main/70">
                    Harga
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({ ...formData, harga: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-main/70">
                    Satuan
                  </label>
                  <select
                    value={formData.satuan}
                    onChange={(e) =>
                      setFormData({ ...formData, satuan: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="kg">Per Kg</option>
                    <option value="item">Per Item</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">
                  Estimasi Selesai (Hari)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.estimasi_hari}
                  onChange={(e) =>
                    setFormData({ ...formData, estimasi_hari: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <label className="text-sm font-medium text-text-main/70 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  Status Layanan Aktif
                </label>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 rounded-xl border border-slate-200 font-medium text-text-main hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:shadow-[0_4px_16px_rgba(15,252,190,0.3)] transform hover:-translate-y-0.5 transition-all"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
