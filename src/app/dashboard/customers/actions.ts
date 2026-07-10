"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCustomer(data: { nama: string; no_hp: string; alamat?: string; email?: string }) {
  await prisma.customer.create({
    data,
  });
  revalidatePath("/dashboard/customers");
}

export async function updateCustomer(id: string, data: { nama: string; no_hp: string; alamat?: string; email?: string }) {
  await prisma.customer.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({
    where: { id },
  });
  revalidatePath("/dashboard/customers");
}
