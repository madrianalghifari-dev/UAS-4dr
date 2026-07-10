"use client";

import { useState } from "react";
import { Customer } from "@prisma/client";
import { Plus, Search, Edit2, Trash2, X, ChevronDown } from "lucide-react";
import { createCustomer, updateCustomer, deleteCustomer } from "./actions";
import Link from "next/link";

export function CustomerClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    no_hp: "",
    alamat: "",
    email: "",
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.nama.toLowerCase().includes(search.toLowerCase()) ||
      c.no_hp.includes(search)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        nama: customer.nama,
        no_hp: customer.no_hp,
        alamat: customer.alamat || "",
        email: customer.email || "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({ nama: "", no_hp: "", alamat: "", email: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, formData);
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...formData } : c))
      );
    } else {
      await createCustomer(formData);
      // reload page to get new data with ID, or fetch data, but for simplicity:
      window.location.reload();
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      setIsDeleting(id);
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 h-[calc(100vh-80px)] overflow-hidden gap-6 bg-slate-50">
      {/* Top Banner (setengahnya gambar) */}
      <div className="relative rounded-3xl overflow-hidden shrink-0 h-48 sm:h-64 shadow-sm">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-customers.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Manajemen Pelanggan</h1>
          <p className="text-white/90 max-w-xl text-sm sm:text-base">Kelola data pelanggan, pantau riwayat pesanan, dan tingkatkan loyalitas pelanggan Anda.</p>
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
              placeholder="Cari nama atau no. HP..."
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
            Tambah Pelanggan
          </button>
        </div>

        {/* Table Area (Scrollable internally) */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 shadow-sm">
              <tr className="text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Nama</th>
                <th className="p-4 font-medium">No. HP</th>
                <th className="p-4 font-medium">Alamat</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium text-lg">Tidak ada data pelanggan.</p>
                      <p className="text-slate-400 text-sm">Coba cari dengan kata kunci lain atau tambah baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-4 font-medium text-slate-800">
                      {customer.nama}
                      {customer.email && (
                        <span className="block text-xs text-slate-500 font-normal mt-0.5">
                          {customer.email}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">{customer.no_hp}</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {customer.alamat || "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(customer)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          disabled={isDeleting === customer.id}
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
                {editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan"}
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
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">
                  No. HP
                </label>
                <input
                  type="text"
                  required
                  value={formData.no_hp}
                  onChange={(e) =>
                    setFormData({ ...formData, no_hp: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">
                  Email <span className="text-xs font-normal">(Opsional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">
                  Alamat <span className="text-xs font-normal">(Opsional)</span>
                </label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                />
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
