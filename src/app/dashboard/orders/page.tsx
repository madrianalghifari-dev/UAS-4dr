import prisma from "@/lib/prisma";
import { OrderClient } from "./order-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesanan - Laundry Management",
};

export default async function OrdersPage() {
  const [orders, customers, services] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        service: true,
      },
    }),
    prisma.customer.findMany({
      orderBy: { nama: "asc" },
    }),
    prisma.service.findMany({
      where: { is_active: true },
      orderBy: { nama_layanan: "asc" },
    }),
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      <OrderClient
        initialOrders={JSON.parse(JSON.stringify(orders))}
        customers={JSON.parse(JSON.stringify(customers))}
        services={JSON.parse(JSON.stringify(services))}
      />
    </div>
  );
}
