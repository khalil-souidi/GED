import { Departement } from "./Departement.model";

export interface Users {
    id: number;
    username: string;
    email: string;
    prenom: string;
    nom: string;
    department: Departement;
    documents?: Document[];
  }
  