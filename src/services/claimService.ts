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
    const res: any = await apiClient.post(`/businesses/${businessId}/claim`, data);
    return res?.data?.claim || res?.data || res?.claim || res;
  },

  // Current user's claims
  async getMyClaims(): Promise<BusinessClaim[]> {
    const res: any = await apiClient.get('/business-owner/claims');
    return res?.data?.claims || res?.data || res?.claims || (Array.isArray(res) ? res : []);
  },

  // Admin gets all claims
  async getAllClaims(status?: string): Promise<BusinessClaim[]> {
    const res: any = await apiClient.get('/admin/claims', { params: { status } });
    return res?.data?.claims || res?.data || res?.claims || (Array.isArray(res) ? res : []);
  },

  // Admin approves claim
  async approveClaim(claimId: string) {
    const res: any = await apiClient.patch(`/admin/claims/${claimId}/approve`);
    return res?.data?.claim || res?.data || res?.claim || res;
  },

  // Admin rejects claim
  async rejectClaim(claimId: string, reason?: string) {
    const res: any = await apiClient.patch(`/admin/claims/${claimId}/reject`, { reason });
    return res?.data?.claim || res?.data || res?.claim || res;
  },
};
