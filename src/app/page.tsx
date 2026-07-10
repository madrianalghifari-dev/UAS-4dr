import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Clock, ShoppingBag, CheckCircle, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export const metadata: Metadata = {
  title: "CleanWash - The Perfect Care For Your Clothes",
};

async function getStats() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [
    totalOrdersToday,
    pendingOrders,
    revenueTodayAggr,
    completedToday,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        tanggal_masuk: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    prisma.order.count({
      where: {
        status: {
          in: ["diterima", "proses_cuci", "proses_setrika"],
        },
      },
    }),
    prisma.order.aggregate({
      _sum: {
        total_harga: true,
      },
      where: {
        tanggal_masuk: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    prisma.order.count({
      where: {
        status: "selesai",
        tanggal_masuk: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
  ]);

  return {
    totalOrdersToday,
    pendingOrders,
    revenueToday: revenueTodayAggr._sum.total_harga || 0,
    completedToday,
  };
}

export default async function Home() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Pesanan Hari Ini",
      value: stats.totalOrdersToday,
      icon: ShoppingBag,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-500",
    },
    {
      title: "Pesanan Pending",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-warning",
      lightColor: "bg-warning/10",
      textColor: "text-warning",
    },
    {
      title: "Selesai Hari Ini",
      value: stats.completedToday,
      icon: CheckCircle,
      color: "bg-accent",
      lightColor: "bg-accent/20",
      textColor: "text-accent-hover",
    },
    {
      title: "Pendapatan Hari Ini",
      value: `Rp ${stats.revenueToday.toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-500",
    },
  ];

  return (
    <div className="bg-white relative z-10 flex flex-col scroll-smooth">
      <Navbar />

      {/* Full Screen Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-laundry.png')" }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-black/40 to-accent/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        


        {/* Content */}
        <div className="relative z-10 max-w-3xl text-white">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-shadow-sm drop-shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            The Perfect Care For Your Clothes
          </h2>
          <p className="text-lg md:text-xl font-medium mb-12 text-white/90 drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Kami mengutamakan kesehatan dan kebersihan. Pakaian yang higienis membawa gaya hidup yang lebih baik.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Link 
              href="#dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold py-4 px-10 rounded-full shadow-[0_8px_32px_rgba(15,252,190,0.4)] transition-all transform hover:-translate-y-1 text-lg"
            >
              Lihat Dashboard
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <Link href="#dashboard" className="text-white/80 hover:text-white flex flex-col items-center">
            <span className="text-sm font-medium mb-2 tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
              Kualitas Terbaik Untuk Pakaian Anda
            </h3>
            <p className="text-lg text-text-main/60 max-w-2xl mx-auto">
              Kami memberikan pelayanan prima di setiap tahap pencucian untuk memastikan pakaian Anda selalu bersih, harum, dan tampak seperti baru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src="/images/feature-washing.png" alt="Pencucian Berkualitas" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-3">Pencucian Berkualitas</h4>
                <p className="text-slate-600">Menggunakan mesin modern dan deterjen premium yang ampuh menghilangkan noda membandel sekaligus merawat serat kain.</p>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src="/images/feature-folding.png" alt="Setrika & Lipat Rapi" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-3">Setrika & Lipat Rapi</h4>
                <p className="text-slate-600">Setiap helai pakaian disetrika dengan suhu yang tepat dan dilipat rapi, siap untuk langsung masuk ke lemari Anda.</p>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src="/images/feature-fast.png" alt="Layanan Cepat & Ramah" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-3">Layanan Cepat & Ramah</h4>
                <p className="text-slate-600">Pengerjaan tepat waktu sesuai estimasi yang dijanjikan, didukung oleh tim pelayanan pelanggan yang selalu siap membantu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[url('/images/laundry-pattern.png')] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
              Ringkasan Bisnis Hari Ini
            </h3>
            <p className="text-lg text-text-main/60">
              Pantau aktivitas dan statistik laundry Anda secara real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-xl transition-all transform hover:-translate-y-2 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.lightColor} ${stat.textColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-main/60 mb-2 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500">
                      {stat.value}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 p-8 mt-12">
            <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
              <Clock className="text-primary w-6 h-6" />
              Aktivitas Terakhir
            </h2>
            <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-text-main/50 font-medium">Belum ada aktivitas terbaru hari ini.</p>
              <p className="text-sm text-text-main/40 mt-1">Aktivitas pesanan baru akan muncul di sini.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
