import { Departement } from "./Departement.model";
import { DocumentStatus } from "./DocumentStatus.model";
import { DocumentVersion } from "./DocumentVersion.model";
import { Metadata } from "./Metadata.model";
import { TypeDocument } from "./type-document.model";
import { Users } from "./Users.model";
import { Workflow } from "./Workflow.model";

export interface Document {
    id: number;
    typeDoc: TypeDocument;
    nomDoc: string;
    nomClient: string;
    numClient: string;
    emailClient: string;
    codeUnique: string;
    dateCreation: Date;
    documentStatus: DocumentStatus;
    departement: Departement;
    metadata: Metadata;
    workflow: Workflow;
    uploadedBy: Users;
    commentaireRejet: string;
    versions: DocumentVersion[];
    archived: boolean;
  }
  