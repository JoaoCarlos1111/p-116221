
export type UserRole = 'admin' | 'client' | 'verification_analyst' | 'prospection_analyst';

export interface RolePermissions {
  allowedRoutes: string[];
  visibleSectors: string[];
}

export const roleConfig: Record<UserRole, RolePermissions> = {
  admin: {
    allowedRoutes: ['*'],
    visibleSectors: ['*']
  },
  client: {
    allowedRoutes: ['/dashboard', '/cases'],
    visibleSectors: ['*']
  },
  verification_analyst: {
    allowedRoutes: ['/kanban/verification', '/dashboard/verification'],
    visibleSectors: ['Verificação']
  },
  prospection_analyst: {
    allowedRoutes: ['/kanban/prospection', '/dashboard/prospection'],
    visibleSectors: ['Prospecção']
  }
};
