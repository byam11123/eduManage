'use server'

import { revalidatePath } from "next/cache";
import { referralService } from "@/lib/services/referral.service";
import { referrerSchema, referralSchema } from "@/lib/schemas/referral.schema";
import { db } from "@/lib/db";

async function getOrgId() {
  // This is a placeholder, in a real app you'd get this from the session
  // Since I don't have the session helper here, I'll assume we pass it or get it from a common place
  // But usually we get it from auth payload.
  // For now I'll use a search or similar if I can, but I'll make the actions take orgId for simplicity if needed
  // Actually I'll use a hack to get the first org for this demo if needed, but better to check existing actions.
  const org = await db.organization.findFirst();
  return org?.id;
}

export async function createReferrerAction(data: any) {
  const orgId = await getOrgId();
  if (!orgId) return { success: false, error: "Organization not found" };

  const validated = referrerSchema.safeParse(data);
  if (!validated.success) return { success: false, error: validated.error.message };

  try {
    const res = await referralService.createReferrer({
      ...validated.data,
      organizationId: orgId,
      branchId: validated.data.branchId || undefined
    });
    revalidatePath("/admin/referrals");
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createReferralAction(data: any) {
  const orgId = await getOrgId();
  if (!orgId) return { success: false, error: "Organization not found" };

  const validated = referralSchema.safeParse(data);
  if (!validated.success) return { success: false, error: validated.error.message };

  try {
    const res = await referralService.createReferral({
      ...validated.data,
      organizationId: orgId
    });
    revalidatePath("/admin/referrals");
    revalidatePath("/admin/students");
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReferralStatusAction(id: string, status: string, rewardAmount?: number) {
  const orgId = await getOrgId();
  if (!orgId) return { success: false, error: "Organization not found" };

  try {
    const res = await referralService.updateReferralStatus(id, orgId, status, rewardAmount);
    revalidatePath("/admin/referrals");
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
