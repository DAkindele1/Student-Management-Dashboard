import { z } from 'zod';

const genderEnum = z.enum(['MALE', 'FEMALE']);
const studentBody = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  gender: genderEnum,
  dateOfBirth: z.coerce.date(),
  classId: z.string().min(1, 'Assigned class is required'),
});

export const createStudentSchema = z.object({ body: studentBody });
export const updateStudentSchema = z.object({ body: studentBody.partial() });