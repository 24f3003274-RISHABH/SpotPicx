export type OpportunityType =
  | 'Scholarship'
  | 'Hackathon'
  | 'Coding Competition'
  | 'Research Program'
  | 'Fellowship'
  | 'Developer Program'
  | 'Open Source'
  | 'Entrepreneurship'
  | 'Student Conference';

export type OpportunityStatus = 'Open' | 'Upcoming' | 'Closed' | 'Unknown' | 'Expired';

export interface Opportunity {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  organization: string;
  organizationLogo?: string;
  officialWebsite: string;
  officialApplicationLink: string;
  opportunityType: OpportunityType;
  eligibility: string;
  whoShouldApply: string;
  shortDescription: string;
  fullDescription?: string;
  location: string;
  locationType: 'Remote' | 'Global' | 'In-Person' | 'Hybrid';
  deadline: string | null; // ISO string or null
  isDeadlineVerified: boolean;
  status: OpportunityStatus;
  isFeatured: boolean;
  isThisWeek: boolean;
  stipendOrPrize?: string;
  tags: string[];
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpportunityFilters {
  opportunityType?: string;
  status?: string;
  search?: string;
  isFeatured?: boolean;
  isThisWeek?: boolean;
  locationType?: string;
  sort?: 'deadline' | 'newest' | 'recommended' | string;
  page?: number;
  limit?: number;
}
