export interface AuditLog {
  action: string;
  entity: string;
  entityId: number;
  documentName: string; // Add this field
  details: string;
  timestamp: Date;
  user: any; // or a specific User model
}
