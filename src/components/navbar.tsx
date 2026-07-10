"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import clsx from "clsx";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-16 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <Droplets className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
        <h1 className="text-2xl font-bold text-primary italic">
          Clean<span className="text-accent drop-shadow-sm">Wash</span>
        </h1>
      </Link>
      <nav className="hidden md:flex items-center gap-8 font-medium">
        <Link 
          href="/" 
          className={clsx(
            "transition-colors", 
            pathname === "/" ? "text-primary border-b-2 border-primary pb-1" : "text-text-main hover:text-primary"
          )}
        >
          Dashboard
        </Link>
        <Link 
          href="/dashboard/customers" 
          className={clsx(
            "transition-colors", 
            pathname === "/dashboard/customers" ? "text-primary border-b-2 border-primary pb-1" : "text-text-main hover:text-primary"
          )}
        >
          Pelanggan
        </Link>
        <Link 
          href="/dashboard/services" 
          className={clsx(
            "transition-colors", 
            pathname === "/dashboard/services" ? "text-primary border-b-2 border-primary pb-1" : "text-text-main hover:text-primary"
          )}
        >
          Layanan
        </Link>
        <Link 
          href="/dashboard/orders" 
          className={clsx(
            "transition-colors", 
            pathname === "/dashboard/orders" ? "text-primary border-b-2 border-primary pb-1" : "text-text-main hover:text-primary"
          )}
        >
          Pesanan
        </Link>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="ml-4 px-4 py-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          Logout
        </button>
      </nav>
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm font-bold text-red-500"
        >
          Logout
        </button>
        <button className="text-text-main">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
