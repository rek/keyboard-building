import { UserChoices } from '../contexts/UserChoicesContext';

export interface AssemblyPhase {
  id: string;
  title: string;
  order: number;
  description: string;
  icon: string;
  estimatedTime: string;
  steps: AssemblyStep[];
}

export interface AssemblyStep {
  id: string;
  title: string;
  description: string;
  estimatedTime?: string;
  order: number;
  content: string;
  requirements: StepRequirements;
  variations?: StepVariation[];
  warnings?: string[];
  tips?: string[];
  requiredTools?: string[];
  externalLinks?: ExternalLink[];
  completionCriteria?: string[];
}

export interface StepRequirements {
  buildMethod?: string[] | null;
  layout?: { formFactor?: string[] } | null;
  controller?: string[] | null;
  firmware?: string[] | null;
  connectivity?: string[] | null;
  switchType?: string[] | null;
  features?: Partial<Record<keyof UserChoices['features'], boolean>> | null;
}

export interface StepVariation {
  condition: Record<string, any>;
  additionalContent?: string;
  warnings?: string[];
  tips?: string[];
}

export interface ExternalLink {
  title: string;
  url: string;
  type: 'article' | 'video' | 'tool' | 'docs';
  description: string;
}

export interface TroubleshootingIssue {
  id: string;
  symptom: string;
  possibleCauses: string[];
  solutions: string[];
  relatedSteps?: string[];
}

export interface AssemblyData {
  phases: AssemblyPhase[];
  troubleshooting: {
    common_issues: TroubleshootingIssue[];
  };
}
