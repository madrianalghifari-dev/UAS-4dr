"use client";

import { useState, useEffect } from "react";
import { Order, Customer, Service } from "@prisma/client";
import { Plus, Search, CheckCircle, Clock, MoreVertical, Loader2, X, ChevronDown, Printer, Trash2 } from "lucide-react";
import { createOrder, updateOrderStatus, deleteOrder } from "./actions";
import Link from "next/link";
import { format } from "date-fns";

type OrderWithRelations = Order & {
  customer: Customer;
  service: Service;
};

const STATUS_OPTIONS = [
  { value: "diterima", label: "Diterima", color: "bg-slate-100 text-slate-700" },
  { value: "proses_cuci", label: "Proses Cuci", color: "bg-warning/20 text-warning" },
  { value: "proses_setrika", label: "Proses Setrika", color: "bg-warning/20 text-warning" },
  { value: "siap_diambil", label: "Siap Diambil", color: "bg-primary/20 text-primary" },
  { value: "selesai", label: "Selesai", color: "bg-accent/20 text-accent-hover" },
  { value: "dibatalkan", label: "Dibatalkan", color: "bg-danger/10 text-danger" },
];

export function OrderClient({
  initialOrders,
  customers,
  services,
}: {
  initialOrders: OrderWithRelations[];
  customers: Customer[];
  services: Service[];
}) {
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    service_id: "",
    berat_kg: 0,
    jumlah_item: 0,
    catatan: "",
  });

  const selectedService = services.find((s) => s.id === formData.service_id);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.kode_invoice.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.nama.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = () => {
    setFormData({
      customer_id: customers[0]?.id || "",
      service_id: services[0]?.id || "",
      berat_kg: 0,
      jumlah_item: 0,
      catatan: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder({
      ...formData,
      berat_kg: formData.berat_kg || undefined,
      jumlah_item: formData.jumlah_item || undefined,
    });
    handleCloseModal();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateOrderStatus(id, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
      setIsDeleting(id);
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setIsDeleting(null);
    }
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    return selectedService.satuan === "kg"
      ? formData.berat_kg * selectedService.harga
      : formData.jumlah_item * selectedService.harga;
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 h-[calc(100vh-80px)] overflow-hidden gap-6 bg-slate-50">
      {/* Top Banner (setengahnya gambar) */}
      <div className="relative rounded-3xl overflow-hidden shrink-0 h-48 sm:h-64 shadow-sm">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-orders.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Kelola Pesanan</h1>
          <p className="text-white/90 max-w-xl text-sm sm:text-base">Buat pesanan baru, pantau status pengerjaan, dan pastikan cucian pelanggan selesai tepat waktu.</p>
        </div>
      </div>

      {/* Bottom Box (setengahnya kotak) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        {/* Header Actions */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari invoice atau pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm bg-white"
            >
              <option value="all">Semua Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-[0_4px_16px_rgba(15,252,190,0.3)] transform hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Pesanan Baru
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 shadow-sm">
              <tr className="text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Invoice & Pelanggan</th>
                <th className="p-4 font-medium">Layanan</th>
                <th className="p-4 font-medium">Total Harga</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium text-lg">Tidak ada data pesanan.</p>
                      <p className="text-slate-400 text-sm">Coba ubah filter atau cari dengan kata kunci lain.</p>
                    </div>
                  </td>
                </tr>
              ) : (
              filteredOrders.map((order) => {
                const statusOpt = STATUS_OPTIONS.find((s) => s.value === order.status);
                
                return (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{order.kode_invoice}</p>
                      <p className="font-medium text-slate-600 text-sm">{order.customer.nama}</p>
                      <p className="text-xs text-slate-400">
                        Masuk: {format(new Date(order.tanggal_masuk), "dd MMM yyyy")}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-700 text-sm">{order.service.nama_layanan}</p>
                      <p className="text-xs text-slate-500">
                        {order.service.satuan === "kg" ? `${order.berat_kg} kg` : `${order.jumlah_item} item`}
                      </p>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      Rp {order.total_harga.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none px-3 py-1.5 pr-8 rounded-full text-xs font-semibold focus:outline-none cursor-pointer border-none shadow-sm ${statusOpt?.color}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => alert("Fitur cetak invoice akan tersedia.")}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Cetak Struk"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={isDeleting === order.id}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.1)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/50">
              <h2 className="text-xl font-bold text-text-main">Buat Pesanan Baru</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">Pelanggan</label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                >
                  <option value="" disabled>Pilih Pelanggan</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.nama} - {c.no_hp}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">Layanan</label>
                <select
                  required
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value, berat_kg: 0, jumlah_item: 0 })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                >
                  <option value="" disabled>Pilih Layanan</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama_layanan} (Rp {s.harga.toLocaleString("id-ID")}/{s.satuan})
                    </option>
                  ))}
                </select>
              </div>

              {selectedService && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-main/70">
                    {selectedService.satuan === "kg" ? "Berat (Kg)" : "Jumlah Item"}
                  </label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step={selectedService.satuan === "kg" ? "0.1" : "1"}
                    value={selectedService.satuan === "kg" ? formData.berat_kg : formData.jumlah_item}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (selectedService.satuan === "kg") {
                        setFormData({ ...formData, berat_kg: val });
                      } else {
                        setFormData({ ...formData, jumlah_item: val });
                      }
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main/70">Catatan (Opsional)</label>
                <textarea
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  placeholder="Contoh: Pisahkan luntur"
                />
              </div>

              <div className="bg-surface p-4 rounded-xl flex items-center justify-between border border-slate-100">
                <span className="text-sm font-medium text-text-main/70">Total Biaya:</span>
                <span className="text-xl font-bold text-primary">
                  Rp {calculateTotal().toLocaleString("id-ID")}
                </span>
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
                  disabled={!formData.customer_id || !formData.service_id || calculateTotal() <= 0}
                  className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:shadow-[0_4px_16px_rgba(15,252,190,0.3)] transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
                >
                  Buat Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
