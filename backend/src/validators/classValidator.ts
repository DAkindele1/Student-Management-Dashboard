import { z } from 'zod';

const classBody = z.object({
  name: z.string().min(1, 'Class name is required'),
  section: z.string().min(1, 'Section is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
});

export const createClassSchema = z.object({ body: classBody });
export const updateClassSchema = z.object({ body: classBody.partial() });