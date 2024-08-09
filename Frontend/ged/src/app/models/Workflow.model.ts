import { EtapeWorkflow } from "./EtapeWorkflow.model";

export interface Workflow {
    id: number;
    document: Document;
    etapeCourante: EtapeWorkflow;
    dateAction: Date;
  }
  