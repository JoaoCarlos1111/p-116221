
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
    // Credenciais de teste
    const testCredentials = {
      admin: {
        email: 'admin@tbp.com',
        password: 'admin123',
        user: {
          id: '1',
          name: 'Administrador',
          email: 'admin@tbp.com',
          departments: Object.values(departments),
          mainDepartment: departments.ADMIN,
          isAdmin: true
        }
      },
      user: {
        email: 'user@tbp.com',
        password: 'user123',
        user: {
          id: '2',
          name: 'Usuário Teste',
          email: 'user@tbp.com',
          departments: [departments.VERIFICACAO],
          mainDepartment: departments.VERIFICACAO,
          isAdmin: false
        }
      }
    };

    // Simula delay da rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verifica credenciais
    const adminMatch = email === testCredentials.admin.email && password === testCredentials.admin.password;
    const userMatch = email === testCredentials.user.email && password === testCredentials.user.password;

    if (adminMatch || userMatch) {
      const userData = adminMatch ? testCredentials.admin.user : testCredentials.user.user;
      return {
        token: 'test-jwt-token-' + userData.id,
        user: userData
      };
    }

    throw new Error('Credenciais inválidas');
  }
};
