// types/severity.ts

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Issue {
  category: string;
  severity: IssueSeverity;
  title: string;
  description: string;
  isDangerous: boolean; // NEW - differentiates dangerous vs missing
  impact: string;
  recommendation: string;
  evidence: string[];
}