"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, User } from "lucide-react";

export function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 lg:px-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-text-main/70 hover:bg-surface rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-text-main hidden sm:block">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-text-main">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-text-main/50 capitalize">
              {session?.user?.role || "Role"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger bg-danger/5 hover:bg-danger/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Keluar</span>
        </button>
      </div>
    </header>
  );
}
