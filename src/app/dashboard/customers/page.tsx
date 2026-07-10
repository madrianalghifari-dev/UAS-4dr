import prisma from "@/lib/prisma";
import { CustomerClient } from "./customer-client";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pelanggan - Laundry Management",
};

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CustomerClient initialCustomers={customers} />
    </div>
  );
}
