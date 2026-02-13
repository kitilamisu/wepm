export interface Comic {
  id: string;
  title: string;
  originalTitle?: string;
  company: string;
  genre: string[];
  age: string;
  status: string;
  countries: string[];
  imageUrl: string;
  description: string;
  // Extended fields for Detail View
  authors?: string;
  startYear?: string;
  platform?: string;
  format?: string;
  promotionalLink?: string;
  distributionType?: string;
  targetDemographic?: {
    gender: string;
    ageRanges: string[];
  }
  // For custom dynamic categories
  customValues?: Record<string, string[]>; 
}

// We change CategoryData to a loose record to allow dynamic keys
export type CategoryData = Record<string, string[]>;

export interface CategoryDefinition {
  id: string;      // Internal key, e.g., 'companies', 'moods'
  label: string;   // Display name, e.g., 'Company', 'Mood'
  isSystem: boolean; // If true, maps to specific Comic fields. If false, maps to customValues.
  type: 'single' | 'multiple'; // Selection type
}

export interface SiteConfig {
  mainTitle: string;
  subTitle: string;
  logoText: string;
  logoImageUrl?: string;
}