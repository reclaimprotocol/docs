export type VerificationStatus = 'waiting' | 'verifying' | 'verified' | 'failed' | 'cancelled' | 'expired';

export interface VerificationState {
  id: string;
  verificationUrl: string;
  status: VerificationStatus;
  expiresAt: string;
  message?: string;
  data?: { commit_message: string; commit_date: string };
}
