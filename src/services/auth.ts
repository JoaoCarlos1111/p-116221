
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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
