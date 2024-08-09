import { Departement } from "./Departement.model";
import { DocumentStatus } from "./DocumentStatus.model";
import { Metadata } from "./Metadata.model";
import { Users } from "./Users.model";

export interface DocumentVersion {
    id: number;
    document: Document;
    versionNumber: number;
    nomDoc: string;
    nomClient: string;
    numClient: string;
    emailClient: string;
    dateCreation: Date;
    documentStatus: DocumentStatus;
    departement: Departement;
    metadata: Metadata;
    uploadedBy: Users;
    commentaireRejet: string;
  }
  