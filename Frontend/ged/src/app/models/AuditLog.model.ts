import { Users } from "./Users.model";

export interface AuditLog {
    id: number;
    action: string;
    entity: string;
    entityId: number;
    details: string;
    timestamp: Date;
    user: Users;
  }
  