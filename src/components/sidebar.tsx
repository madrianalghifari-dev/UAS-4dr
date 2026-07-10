"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shirt,
  ShoppingCart,
  Droplets,
} from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pelanggan", href: "/dashboard/customers", icon: Users },
  { name: "Layanan", href: "/dashboard/services", icon: Shirt },
  { name: "Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-white/70 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Droplets className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-primary italic leading-tight">
            Clean<span className="text-accent drop-shadow-sm">Wash</span>
          </h1>
          <p className="text-xs text-text-main/50">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? pathname === item.href 
            : (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group",
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_4px_16px_rgba(15,252,190,0.3)] transform hover:scale-[1.02]"
                  : "text-text-main/70 hover:bg-white/50 hover:text-primary"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-text-main/40 group-hover:text-primary"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
