export enum AgeGroup {
  INFANT_YOUNG = 'Infant (0-6 months)',
  INFANT_OLDER = 'Infant (6-12 months)',
  TODDLER_YOUNG = 'Toddler (1-2 years)',
  TODDLER_OLDER = 'Toddler (2-3 years)',
  PRESCHOOL = 'Preschooler (3-5 years)'
}

export enum ActivityType {
  SENSORY = 'Sensory Play',
  PHYSICAL = 'Physical/Active',
  CREATIVE = 'Arts & Creative',
  QUIET = 'Quiet Time',
  EDUCATIONAL = 'Educational'
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  materials: string[];
  duration: string;
  safetyTip: string;
  tags: string[];
  category: string;
}

export interface ActivityRequest {
  ageGroup: AgeGroup;
  materialsAvailable?: string;
  childInterests?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}