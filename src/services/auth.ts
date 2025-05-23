
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
    // Credenciais de teste para cada setor
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
      prospeccao: {
        email: 'prospeccao@tbp.com',
        password: 'tbp123',
        user: {
          id: '2',
          name: 'Equipe Prospecção',
          email: 'prospeccao@tbp.com',
          departments: [departments.PROSPECCAO],
          mainDepartment: departments.PROSPECCAO,
          isAdmin: false
        }
      },
      verificacao: {
        email: 'verificacao@tbp.com',
        password: 'tbp123',
        user: {
          id: '3',
          name: 'Equipe Verificação',
          email: 'verificacao@tbp.com',
          departments: [departments.VERIFICACAO],
          mainDepartment: departments.VERIFICACAO,
          isAdmin: false
        }
      },
      auditoria: {
        email: 'auditoria@tbp.com',
        password: 'tbp123',
        user: {
          id: '8',
          name: 'Equipe Auditoria',
          email: 'auditoria@tbp.com',
          departments: [departments.AUDITORIA],
          mainDepartment: departments.AUDITORIA,
          isAdmin: false
        }
      },
      iptools: {
        email: 'iptools@tbp.com',
        password: 'tbp123',
        user: {
          id: '4',
          name: 'Equipe IP Tools',
          email: 'iptools@tbp.com',
          departments: [departments.IP_TOOLS],
          mainDepartment: departments.IP_TOOLS,
          isAdmin: false
        }
      },
      logistica: {
        email: 'logistica@tbp.com',
        password: 'tbp123',
        user: {
          id: '5',
          name: 'Equipe Logística',
          email: 'logistica@tbp.com',
          departments: [departments.LOGISTICA],
          mainDepartment: departments.LOGISTICA,
          isAdmin: false
        }
      },
      atendimento: {
        email: 'atendimento@tbp.com',
        password: 'tbp123',
        user: {
          id: '6',
          name: 'Equipe Atendimento',
          email: 'atendimento@tbp.com',
          departments: [departments.ATENDIMENTO],
          mainDepartment: departments.ATENDIMENTO,
          isAdmin: false
        }
      },
      financeiro: {
        email: 'financeiro@tbp.com',
        password: 'tbp123',
        user: {
          id: '7',
          name: 'Equipe Financeiro',
          email: 'financeiro@tbp.com',
          departments: [departments.FINANCEIRO],
          mainDepartment: departments.FINANCEIRO,
          isAdmin: false
        }
      }
    };

    // Simula delay da rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verifica credenciais
    const match = Object.values(testCredentials).find(
      cred => cred.email === email && cred.password === password
    );

    if (match) {
      return {
        token: 'test-jwt-token-' + match.user.id,
        user: match.user
      };
    }

    throw new Error('Credenciais inválidas');
  }
};
