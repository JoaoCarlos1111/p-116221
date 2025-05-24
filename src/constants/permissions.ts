
export const departments = {
  PROSPECCAO: 'prospeccao',
  VERIFICACAO: 'verificacao',
  AUDITORIA: 'auditoria',
  LOGISTICA: 'logistica',
  IPTOOLS: 'ip_tools',
  ATENDIMENTO: 'atendimento',
  FINANCEIRO: 'financeiro',
  ADMIN: 'admin',
  CLIENTE: 'cliente'
} as const;

export const permissions = {
  [departments.PROSPECCAO]: {
    pages: ['/prospeccao'],
    actions: ['add_case', 'edit_case', 'delete_case', 'view_documents', 'upload_documents', 'view_dashboard']
  },
  [departments.VERIFICACAO]: {
    pages: ['/verificacao'],
    actions: ['approve_case', 'reject_case', 'add_notes', 'upload_documents', 'view_documents', 'edit_case', 'view_dashboard']
  },
  [departments.AUDITORIA]: {
    pages: ['/auditoria'],
    actions: ['view_logs', 'generate_reports', 'view_dashboard']
  },
  [departments.LOGISTICA]: {
    pages: ['/logistica'],
    actions: ['add_notification', 'track_notification', 'update_status', 'view_dashboard']
  },
  [departments.IPTOOLS]: {
    pages: ['/iptools'],
    actions: ['add_links', 'send_reports', 'track_removal', 'view_dashboard']
  },
  [departments.ATENDIMENTO]: {
    pages: ['/atendimento'],
    actions: ['contact_infractor', 'add_chat_history', 'create_agreement', 'upload_documents', 'view_dashboard']
  },
  [departments.FINANCEIRO]: {
    pages: ['/financeiro'],
    actions: ['register_installments', 'mark_payments', 'upload_receipts', 'manage_kanban', 'view_dashboard']
  },
  [departments.ADMIN]: {
    pages: ['*'],
    actions: ['*']
  },
  [departments.CLIENTE]: {
    pages: ['/approvals'],
    actions: ['view_cases', 'approve_notification', 'reject_notification', 'view_dashboard']
  }
} as const;
