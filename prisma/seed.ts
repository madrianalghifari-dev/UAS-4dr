import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@laundry.com" },
    update: {},
    create: {
      nama: "Admin Utama",
      email: "admin@laundry.com",
      password: adminPassword,
      role: "admin",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@laundry.com" },
    update: {},
    create: {
      nama: "Staff Kasir",
      email: "staff@laundry.com",
      password: staffPassword,
      role: "staff",
    },
  });

  const service1 = await prisma.service.create({
    data: {
      nama_layanan: "Cuci Kering",
      satuan: "kg",
      harga: 6000,
      estimasi_hari: 2,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      nama_layanan: "Cuci Setrika",
      satuan: "kg",
      harga: 8000,
      estimasi_hari: 3,
    },
  });
  
  const customer1 = await prisma.customer.create({
    data: {
      nama: "Budi Santoso",
      no_hp: "081234567890",
      alamat: "Jl. Sudirman No. 1",
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
