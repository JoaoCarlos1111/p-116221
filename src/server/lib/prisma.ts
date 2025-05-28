import { PrismaClient } from '@prisma/client';

console.log('🗄️ Initializing Prisma client...');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export default prisma;