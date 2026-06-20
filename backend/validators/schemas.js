import { z } from "zod";

const email = z.string().email();
const password = z.string().min(6).max(128);
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    email,
    age: z.union([z.string(), z.number()]),
    mobile: z.string().min(8).max(15),
    password,
  }),
});

export const loginSchema = z.object({
  body: z.object({ email, password: z.string().min(1) }),
});

export const complaintRegisterSchema = z.object({
  body: z.object({
    description: z.string().min(10).max(5000).trim(),
    type: z.string().min(2).max(100).trim(),
    location: z.string().min(2).max(300).trim(),
    severity: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
    category: z.string().max(100).optional(),
    lat: z.union([z.string(), z.number()]).optional(),
    lng: z.union([z.string(), z.number()]).optional(),
    isAnonymous: z.union([z.boolean(), z.string()]).optional(),
  }),
});

export const complaintListSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(["Pending", "In Progress", "Resolved", "Rejected"]).optional(),
    severity: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
    type: z.string().max(100).optional(),
    search: z.string().max(200).optional(),
  }),
});

export const complaintUpdateSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(["Pending", "In Progress", "Resolved", "Rejected"]).optional(),
    note: z.string().max(1000).optional(),
    assignedTo: z.union([objectId, z.literal(""), z.null()]).optional(),
    departmentId: z.union([objectId, z.literal(""), z.null()]).optional(),
    officialResponse: z.string().max(3000).optional(),
    appealAction: z.enum(["accept", "deny"]).optional(),
  }),
});

export const resolutionConfirmSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    confirmed: z.boolean(),
    note: z.string().max(1000).optional(),
  }),
});

export const feedbackSchema = z.object({
  body: z.object({
    description: z.string().min(5).max(3000).trim(),
  }),
});

export const commentSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    text: z.string().min(1).max(2000).trim(),
  }),
});

export const nearbySchema = z.object({
  query: z.object({
    lat: z.string(),
    lng: z.string(),
    radius: z.string().optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email() }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(32),
    password: z.string().min(6).max(128),
  }),
});

export const appealSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    note: z.string().min(5).max(2000).trim(),
  }),
});
