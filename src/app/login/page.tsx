import { LoginForm } from "./login-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Droplets } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Laundry Management",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[24px] shadow-[0_8px_32px_rgba(16,110,190,0.08)] p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
              <Droplets className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-text-main text-center">
              Selamat Datang
            </h1>
            <p className="text-sm text-text-main/60 text-center mt-2">
              Masuk ke sistem manajemen laundry
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
