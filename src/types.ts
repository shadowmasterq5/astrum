export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface ProjectBrief {
  projectTitle: string;
  businessType: string;
  recommendedTier: string;
  estimatedBudgetInr: string;
  keyPages: string[];
  features: string[];
  designDirection: string;
  emailBriefSummary: string;
}

export interface InquiryConfirmation {
  referenceId: string;
  recipientEmail: string;
  mailtoUrl: string;
  formattedEmailText: string;
}

export interface PricingTier {
  id: string;
  name: string;
  priceRange: string;
  turnaround: string;
  summary: string;
  deliverables: string[];
  highlighted?: boolean;
}
