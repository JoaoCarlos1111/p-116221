
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Create departments
  const departments = [
    'admin',
    'prospeccao',
    'verificacao',
    'auditoria',
    'aprovacao',
    'logistica',
    'ip_tools',
    'atendimento',
    'financeiro',
    'client'
  ];

  const createdDepartments = await Promise.all(
    departments.map(name =>
      prisma.department.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  console.log(`✅ Created ${createdDepartments.length} departments`);

  // Create brands
  const brands = [
    'Nike',
    'Adidas',
    'Puma',
    'Under Armour',
    'Louis Vuitton',
    'Gucci',
    'Rolex'
  ];

  const createdBrands = await Promise.all(
    brands.map(name =>
      prisma.brand.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  console.log(`✅ Created ${createdBrands.length} brands`);

  // Create test users with hashed passwords
  const testUsers = [
    {
      name: 'Administrador',
      email: 'admin@tbp.com',
      password: await hashPassword('admin123'),
      mainDepartment: 'admin',
      departments: ['admin'],
      isAdmin: true,
      isClient: false
    },
    {
      name: 'Equipe Prospecção',
      email: 'prospeccao@tbp.com',
      password: await hashPassword('tbp123'),
      mainDepartment: 'prospeccao',
      departments: ['prospeccao'],
      isAdmin: false,
      isClient: false
    },
    {
      name: 'Equipe Verificação',
      email: 'verificacao@tbp.com',
      password: await hashPassword('tbp123'),
      mainDepartment: 'verificacao',
      departments: ['verificacao'],
      isAdmin: false,
      isClient: false
    },
    {
      name: 'Equipe Auditoria',
      email: 'auditoria@tbp.com',
      password: await hashPassword('tbp123'),
      mainDepartment: 'auditoria',
      departments: ['auditoria'],
      isAdmin: false,
      isClient: false
    },
    {
      name: 'Equipe IP Tools',
      email: 'iptools@tbp.com',
      password: await hashPassword('tbp123'),
      mainDepartment: 'ip_tools',
      departments: ['ip_tools'],
      isAdmin: false,
      isClient: false
    },
    {
      name: 'Equipe Logística',
      email: 'logistica@tbp.com',
      password: await hashPassword('tbp123'),
      mainDepartment: 'logistica',
      departments: ['logistica'],
      isAdmin: false,
      isClient: false
    },
    {
      name: 'Equipe Atendimento',
      email: 'atendimento@tbp.com',
      password: await hashPassword('tbp123'),
      mainDepartment: 'atendimento',
      departments: ['atendimento'],
      isAdmin: false,
      isClient: false
    },
    {
      name: 'Equipe Financeiro',
      email: 'financeiro@tbp.com',
      password: await hashPassword('tbp123'),
      mainDepartment: 'financeiro',
      departments: ['financeiro'],
      isAdmin: false,
      isClient: false
    },
    {
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: await hashPassword('cliente123'),
      mainDepartment: 'client',
      departments: [],
      isAdmin: false,
      isClient: true,
      company: 'Empresa Cliente Teste'
    },
    {
      name: 'João Analista',
      email: 'analista.cliente@teste.com',
      password: await hashPassword('analista123'),
      mainDepartment: 'client',
      departments: [],
      isAdmin: false,
      isClient: true,
      clientProfile: 'analista_contrafacao',
      company: 'Empresa Cliente Teste'
    },
    {
      name: 'Maria Financeiro',
      email: 'financeiro.cliente@teste.com',
      password: await hashPassword('financeiro123'),
      mainDepartment: 'client',
      departments: [],
      isAdmin: false,
      isClient: true,
      clientProfile: 'financeiro',
      company: 'Empresa Cliente Teste'
    },
    {
      name: 'Carlos Gestor',
      email: 'gestor.cliente@teste.com',
      password: await hashPassword('gestor123'),
      mainDepartment: 'client',
      departments: [],
      isAdmin: false,
      isClient: true,
      clientProfile: 'gestor',
      company: 'Empresa Cliente Teste'
    }
  ];

  const createdUsers = [];
  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: userData.password,
        isActive: true
      },
      create: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        mainDepartment: userData.mainDepartment,
        isAdmin: userData.isAdmin,
        isClient: userData.isClient,
        clientProfile: userData.clientProfile,
        company: userData.company,
        isActive: true
      }
    });

    // Add user departments
    if (userData.departments.length > 0) {
      await Promise.all(
        userData.departments.map(deptName =>
          prisma.userDepartment.upsert({
            where: {
              userId_departmentId: {
                userId: user.id,
                departmentId: createdDepartments.find(d => d.name === deptName)!.id
              }
            },
            update: {},
            create: {
              userId: user.id,
              departmentId: createdDepartments.find(d => d.name === deptName)!.id
            }
          })
        )
      );
    }

    // Add user brands (for clients)
    if (userData.isClient) {
      const userBrands = ['Nike', 'Adidas'];
      if (userData.clientProfile === 'gestor') {
        userBrands.push('Puma', 'Louis Vuitton');
      }

      await Promise.all(
        userBrands.map(brandName =>
          prisma.userBrand.upsert({
            where: {
              userId_brandId: {
                userId: user.id,
                brandId: createdBrands.find(b => b.name === brandName)!.id
              }
            },
            update: {},
            create: {
              userId: user.id,
              brandId: createdBrands.find(b => b.name === brandName)!.id
            }
          })
        )
      );
    }

    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} users with hashed passwords`);
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
