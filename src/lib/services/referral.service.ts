import { db } from "@/lib/db";
import { CreateReferrerInput, CreateReferralInput } from "@/lib/types/referral.types";

export const referralService = {
  /**
   * Referrers
   */
  async getAllReferrers(organizationId: string, branchId?: string) {
    return await db.referrer.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
      },
      include: {
        _count: {
          select: { referrals: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getReferrerById(id: string, organizationId: string) {
    return await db.referrer.findUnique({
      where: { id, organizationId },
      include: {
        referrals: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                admissionDisplayId: true
              }
            }
          }
        }
      }
    });
  },

  async createReferrer(data: CreateReferrerInput & { organizationId: string }) {
    return await db.referrer.create({
      data
    });
  },

  async updateReferrer(id: string, organizationId: string, data: Partial<CreateReferrerInput>) {
    return await db.referrer.update({
      where: { id, organizationId },
      data
    });
  },

  /**
   * Referrals
   */
  async getAllReferrals(organizationId: string) {
    return await db.referral.findMany({
      where: { organizationId },
      include: {
        referrer: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            admissionDisplayId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createReferral(data: CreateReferralInput & { organizationId: string }) {
    return await db.referral.create({
      data
    });
  },

  async updateReferralStatus(id: string, organizationId: string, status: string, rewardAmount?: number) {
    return await db.referral.update({
      where: { id, organizationId },
      data: {
        status,
        ...(rewardAmount !== undefined ? { rewardAmount } : {})
      }
    });
  },

  async markRewardPaid(id: string, organizationId: string) {
    return await db.referral.update({
      where: { id, organizationId },
      data: {
        rewardStatus: 'paid',
        paidDate: new Date()
      }
    });
  }
};
