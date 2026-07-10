"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createService(data: { nama_layanan: string; satuan: string; harga: number; estimasi_hari: number; is_active: boolean }) {
  await prisma.service.create({
    data,
  });
  revalidatePath("/dashboard/services");
}

export async function updateService(id: string, data: { nama_layanan: string; satuan: string; harga: number; estimasi_hari: number; is_active: boolean }) {
  await prisma.service.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  });
  revalidatePath("/dashboard/services");
}
