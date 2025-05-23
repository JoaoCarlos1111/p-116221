
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const users = [
    {
      email: 'admin@tbp.com',
      password,
      name: 'Admin',
      departments: ['admin'],
      mainDepartment: 'admin',
      isAdmin: true
    },
    {
      email: 'prospeccao@tbp.com',
      password,
      name: 'Prospecção',
      departments: ['prospeccao'],
      mainDepartment: 'prospeccao',
      isAdmin: false
    },
    {
      email: 'verificacao@tbp.com',
      password,
      name: 'Verificação',
      departments: ['verificacao'],
      mainDepartment: 'verificacao',
      isAdmin: false
    },
    {
      email: 'logistica@tbp.com',
      password,
      name: 'Logística',
      departments: ['logistica'],
      mainDepartment: 'logistica',
      isAdmin: false
    },
    {
      email: 'iptools@tbp.com',
      password,
      name: 'IP Tools',
      departments: ['ip_tools'],
      mainDepartment: 'ip_tools',
      isAdmin: false
    },
    {
      email: 'atendimento@tbp.com',
      password,
      name: 'Atendimento',
      departments: ['atendimento'],
      mainDepartment: 'atendimento',
      isAdmin: false
    },
    {
      email: 'financeiro@tbp.com',
      password,
      name: 'Financeiro',
      departments: ['financeiro'],
      mainDepartment: 'financeiro',
      isAdmin: false
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
