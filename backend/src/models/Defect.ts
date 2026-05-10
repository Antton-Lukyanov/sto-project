export interface Defect {
  id: number;
  code: string;
  description: string;
  category: string | null;
}

export interface DefectWithCount extends Defect {
  occurrence_count?: number;
}