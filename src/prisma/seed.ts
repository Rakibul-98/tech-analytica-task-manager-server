import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskapp.com' },
    update: {},
    create: {
      email: 'admin@taskapp.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@taskapp.com' },
    update: {},
    create: {
      email: 'user@taskapp.com',
      password: userPassword,
      name: 'Normal User',
      role: Role.USER,
    },
  });

  console.log('✅ Seeded users:');
  console.log(`  Admin → ${admin.email} (password: admin123)`);
  console.log(`  User  → ${user.email} (password: user123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
