import { apiClient } from '../api/apiClient';

export interface BusinessClaim {
  _id: string;
  business: {
    _id: string;
    name: string;
    slug: string;
    locality?: string;
    city?: string;
    images?: string[];
    address?: string;
    rating?: number;
    verified?: boolean;
    claimed?: boolean;
    owner?: any;
  };
  user: {
    _id: string;
    name: string;
    username?: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  documents: string[];
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: any;
  reviewedAt?: string | null;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const claimService = {
  // User submits claim
  async submitClaim(businessId: string, data: { documents: string[]; message: string }) {
    const res = await apiClient.post<{ success: boolean; data: { claim: BusinessClaim }; message: string }>(
      `/businesses/${businessId}/claim`,
      data
    );
    return res.data.data.claim;
  },

  // Current user's claims
  async getMyClaims(): Promise<BusinessClaim[]> {
    const res = await apiClient.get<{ success: boolean; data: { claims: BusinessClaim[] } }>(
      '/business-owner/claims'
    );
    return res.data.data.claims || [];
  },

  // Admin gets all claims
  async getAllClaims(status?: string): Promise<BusinessClaim[]> {
    const res = await apiClient.get<{ success: boolean; data: { claims: BusinessClaim[]; total: number } }>(
      '/admin/claims',
      { params: { status } }
    );
    return res.data.data.claims || [];
  },

  // Admin approves claim
  async approveClaim(claimId: string) {
    const res = await apiClient.patch<{ success: boolean; data: { claim: BusinessClaim }; message: string }>(
      `/admin/claims/${claimId}/approve`
    );
    return res.data.data.claim;
  },

  // Admin rejects claim
  async rejectClaim(claimId: string, reason?: string) {
    const res = await apiClient.patch<{ success: boolean; data: { claim: BusinessClaim }; message: string }>(
      `/admin/claims/${claimId}/reject`,
      { reason }
    );
    return res.data.data.claim;
  },
};
