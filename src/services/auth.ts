
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const departments = {
  ADMIN: 'admin',
  PROSPECCAO: 'prospeccao',
  VERIFICACAO: 'verificacao',
  APROVACAO: 'aprovacao',
  LOGISTICA: 'logistica',
  IP_TOOLS: 'ip_tools',
  ATENDIMENTO: 'atendimento',
  FINANCEIRO: 'financeiro'
};

export const AuthService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        departments: user.departments,
        mainDepartment: user.mainDepartment,
        isAdmin: user.isAdmin 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        departments: user.departments,
        mainDepartment: user.mainDepartment,
        isAdmin: user.isAdmin 
      } 
    };
  },

  async register(userData: { 
    email: string; 
    password: string; 
    name: string; 
    departments: string[];
    mainDepartment: string;
    isAdmin?: boolean;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isAdmin: userData.isAdmin || false
      }
    });

    return { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      departments: user.departments,
      mainDepartment: user.mainDepartment,
      isAdmin: user.isAdmin 
    };
  },

  hasAccess(userDepartments: string[], requiredDepartment: string) {
    return userDepartments.includes(requiredDepartment) || userDepartments.includes(departments.ADMIN);
  }
};
