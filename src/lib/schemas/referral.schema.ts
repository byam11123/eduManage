import * as z from "zod";

export const referrerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  type: z.enum(["agent", "student", "staff", "other"]),
  branchId: z.string().optional().nullable(),
  defaultCommissionType: z.enum(["fixed", "percentage"]),
  defaultCommissionAmount: z.coerce.number().min(0, "Amount must be positive"),
});

export const referralSchema = z.object({
  referrerId: z.string().min(1, "Referrer is required"),
  studentId: z.string().min(1, "Student is required"),
  rewardAmount: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export type ReferrerFormData = z.infer<typeof referrerSchema>;
export type ReferralFormData = z.infer<typeof referralSchema>;
