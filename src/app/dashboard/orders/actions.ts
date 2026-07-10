"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addDays } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOrder(data: {
  customer_id: string;
  service_id: string;
  berat_kg?: number;
  jumlah_item?: number;
  catatan?: string;
}) {
  const session = await getServerSession(authOptions);
  const service = await prisma.service.findUnique({ where: { id: data.service_id } });
  
  if (!service) throw new Error("Service not found");

  const total_harga =
    service.satuan === "kg"
      ? (data.berat_kg || 0) * service.harga
      : (data.jumlah_item || 0) * service.harga;

  const tanggal_estimasi_selesai = addDays(new Date(), service.estimasi_hari);
  
  // generate invoice code
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await prisma.order.count({
    where: {
      tanggal_masuk: {
        gte: new Date(new Date().setHours(0,0,0,0))
      }
    }
  });
  const kode_invoice = `INV-${dateStr}-${String(count + 1).padStart(3, "0")}`;

  await prisma.order.create({
    data: {
      kode_invoice,
      customer_id: data.customer_id,
      service_id: data.service_id,
      berat_kg: data.berat_kg,
      jumlah_item: data.jumlah_item,
      total_harga,
      tanggal_estimasi_selesai,
      catatan: data.catatan,
      created_by: session?.user?.id,
    },
  });

  revalidatePath("/dashboard/orders");
}

export async function updateOrderStatus(id: string, status: string) {
  const updateData: any = { status };
  if (status === "selesai") {
    updateData.tanggal_selesai_aktual = new Date();
  }

  await prisma.order.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/dashboard/orders");
}

export async function deleteOrder(id: string) {
  await prisma.order.delete({
    where: { id },
  });
  revalidatePath("/dashboard/orders");
}
