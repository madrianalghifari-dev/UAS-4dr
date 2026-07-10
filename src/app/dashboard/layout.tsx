import { Navbar } from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-transparent relative z-10 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
