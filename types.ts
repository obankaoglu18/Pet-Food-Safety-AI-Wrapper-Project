

export enum Species {
  DOG = 'Dog',
  CAT = 'Cat',
  OTHER = 'Other'
}

export interface Pet {
  id: string;
  name: string;
  species: Species; // AI Determined
  breed?: string;   // AI Determined
  age: number;
  weight: number; // Always stored in KG internally
  notes?: string;
  avatarColor: string;
  originalImage?: string; // Base64
  portraitUrl?: string;   // Base64 AI Generated
  allergies?: string[];   // New: Specific allergies
  conditions?: string[];  // New: Health conditions (Diabetes, etc)
}

export enum RiskLevel {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  DANGEROUS = 'DANGEROUS',
  UNKNOWN = 'UNKNOWN'
}

export interface CheckResult {
  detectedFoodName: string; // AI identified name
  canEat: boolean;
  riskLevel: RiskLevel;
  shortSummary: string;
  detailedExplanation: string;
  maxPortionGrams?: number;
  emergencyWarning?: string;
  disclaimer: string;
}

export interface FoodCheck {
  id: string;
  petId: string;
  foodName: string; // Copied from result.detectedFoodName
  timestamp: number;
  result: CheckResult;
  imageUrl?: string;
  barcode?: string; // New: If scanned via barcode
}

export interface SubscriptionPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  savings?: string;
  features: string[];
}

export type ViewState = 
  | { name: 'ONBOARDING' }
  | { name: 'HOME' }
  | { name: 'ADD_PET' }
  | { name: 'EDIT_PET'; petId: string }
  | { name: 'PET_DETAIL'; petId: string }
  | { name: 'NEW_CHECK'; petId: string }
  | { name: 'CHECK_RESULT'; checkId: string }
  | { name: 'HISTORY' }
  | { name: 'SETTINGS' }
  | { name: 'PAYWALL'; fromView?: ViewState; context?: 'LIMIT' | 'CREDIT' };