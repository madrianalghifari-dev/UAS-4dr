import prisma from "@/lib/prisma";
import { ServiceClient } from "./service-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan - Laundry Management",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ServiceClient initialServices={services} />
    </div>
  );
}
