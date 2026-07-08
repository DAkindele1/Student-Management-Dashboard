import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@school.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Password123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin User',
      password: hashedPassword,
    },
    create: {
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
    },
  });

  const classA = await prisma.class.upsert({
    where: {
      name_section: {
        name: "Grade 10",
        section: "A",
      },
    },
    update: {},
    create: {
      name: "Grade 10",
      section: "A",
      capacity: 30,
    },
  });

  const classB = await prisma.class.upsert({
    where: {
      name_section: {
        name: "Grade 11",
        section: "B",
      },
    },
    update: {},
    create: {
      name: "Grade 11",
      section: "B",
      capacity: 28,
    },
  });

  await prisma.student.upsert({
    where: { email: 'amina.johnson@example.com' },
    update: {},
    create: {
      fullName: 'Amina Johnson',
      email: 'amina.johnson@example.com',
      phone: '+1 555 111 2233',
      gender: 'FEMALE',
      dateOfBirth: new Date('2008-06-21'),
      classId: classA.id,
    },
  });

  await prisma.student.upsert({
    where: { email: 'daniel.smith@example.com' },
    update: {},
    create: {
      fullName: 'Daniel Smith',
      email: 'daniel.smith@example.com',
      phone: '+1 555 222 3344',
      gender: 'MALE',
      dateOfBirth: new Date('2007-11-10'),
      classId: classB.id,
    },
  });

  console.log(`Seeded admin ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });