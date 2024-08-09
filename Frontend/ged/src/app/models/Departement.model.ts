import { Users } from "./Users.model";

export interface Departement {
    id: number;
    name: string;
    users?: Users[];
  }
  