import { z } from 'zod';

export const teacherSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters'),

  email: z
    .string()
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits'),

  employeeId: z
    .string()
    .min(3, 'Employee ID is required'),

  department: z
    .string()
    .min(2, 'Department is required'),

  subject: z
    .string()
    .min(2, 'Subject is required'),

  qualification: z
    .string()
    .min(2, 'Qualification is required'),

  experienceYears: z
    .number()
    .min(0, 'Experience cannot be negative'),

  joiningDate: z.string().min(1, 'Joining date is required'),

  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstLogin: z.boolean().default(true),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export type TeacherFormValues = z.infer<
  typeof teacherSchema
>;