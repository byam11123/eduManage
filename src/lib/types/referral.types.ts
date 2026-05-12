import { Referrer, Referral, Student } from "@prisma/client";

export type ReferrerType = 'agent' | 'student' | 'staff' | 'other';
export type ReferralStatus = 'pending' | 'joined' | 'rewarded' | 'cancelled';
export type RewardStatus = 'unpaid' | 'paid' | 'void';

export interface ReferrerWithStats extends Referrer {
  _count?: {
    referrals: number;
  };
}

export interface ReferralWithStudent extends Referral {
  student: {
    firstName: string;
    lastName: string;
    admissionDisplayId: string | null;
  };
}

export interface ReferrerDetail extends Referrer {
  referrals: ReferralWithStudent[];
}

export interface CreateReferrerInput {
  name: string;
  phone?: string;
  email?: string;
  type: ReferrerType;
  branchId?: string;
  defaultCommissionType: 'fixed' | 'percentage';
  defaultCommissionAmount: number;
}

export interface CreateReferralInput {
  referrerId: string;
  studentId: string;
  rewardAmount?: number;
  notes?: string;
}
