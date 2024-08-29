export interface AuditLog {
  action: string;
  entity: string;
  entityId: number;
  documentName: string;
  codeUnique: string;
  details: string;
  timestamp: Date;
  user: any;
}
