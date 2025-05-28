import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'secure-jwt-token-for-tbp-application';
const JWT_EXPIRES_IN = '24h';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  departments: string[];
  mainDepartment: string;
  isAdmin: boolean;
  isClient?: boolean;
  clientProfile?: string;
  brands?: string[];
  company?: string;
}

export class AuthService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  generateToken(user: AuthUser): string {
    const payload = {
      userId: user.id,
      email: user.email,
      departments: user.departments,
      mainDepartment: user.mainDepartment,
      isAdmin: user.isAdmin,
      isClient: user.isClient || false,
      clientProfile: user.clientProfile,
      brands: user.brands,
      company: user.company
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Login with email and password
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          departments: {
            include: {
              department: true
            }
          },
          brands: {
            include: {
              brand: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Check password
      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Usuário inativo');
      }

      // Format user data
      const departments = user.departments.map(ud => ud.department.name);
      const brands = user.brands.map(b => b.brand.name);

      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        departments,
        mainDepartment: user.mainDepartment,
        isAdmin: user.isAdmin,
        isClient: user.isClient,
        clientProfile: user.clientProfile,
        brands,
        company: user.company
      };

      // Generate token
      const token = this.generateToken(authUser);

      console.log('Login successful for:', authUser.name);

      return { token, user: authUser };
    } catch (error) {
      console.log('Login failed for email:', email);
      throw error;
    }
  }

  // Create user with hashed password
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    mainDepartment: string;
    departments: string[];
    isAdmin?: boolean;
    isClient?: boolean;
    clientProfile?: string;
    company?: string;
  }): Promise<AuthUser> {
    try {
      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          mainDepartment: userData.mainDepartment,
          isAdmin: userData.isAdmin || false,
          isClient: userData.isClient || false,
          clientProfile: userData.clientProfile,
          company: userData.company,
          isActive: true
        }
      });

      // Add departments
      if (userData.departments.length > 0) {
        const departmentPromises = userData.departments.map(deptName =>
          this.prisma.userDepartment.create({
            data: {
              userId: user.id,
              department: {
                connectOrCreate: {
                  where: { name: deptName },
                  create: { name: deptName }
                }
              }
            }
          })
        );
        await Promise.all(departmentPromises);
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        departments: userData.departments,
        mainDepartment: user.mainDepartment,
        isAdmin: user.isAdmin,
        isClient: user.isClient,
        clientProfile: user.clientProfile,
        company: user.company
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Erro ao criar usuário');
    }
  }
}