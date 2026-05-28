import { z } from "zod";

export const studentSchema = z.object({
  // Personal
  firstName: z
    .string()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .min(2, "Last name is required"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .optional()
    .or(z.literal("")),

  // Academic
  className: z
    .string()
    .min(1, "Class is required"),

  rollNumber: z
    .string()
    .min(1, "Roll number is required"),

  // Family
  fatherName: z
    .string()
    .optional()
    .or(z.literal("")),

  motherName: z
    .string()
    .optional()
    .or(z.literal("")),

  fatherPhone: z
    .string()
    .optional()
    .or(z.literal("")),

  motherPhone: z
    .string()
    .optional()
    .or(z.literal("")),

  // Address
  address: z
    .string()
    .optional()
    .or(z.literal("")),

  // Security
  password: z.string().min(6, "Password must be at least 6 characters"),

  firstLogin: z.boolean().default(true),
});

export type StudentFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  className: string;
  rollNumber: string;
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  address?: string;
  password: string;
  firstLogin: boolean;
};