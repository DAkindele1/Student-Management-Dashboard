import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { createStudentSchema, updateStudentSchema } from '../validators/studentValidator';
import { paginationSchema } from '../validators/shared';
import { createStudent, deleteStudent, getStudentById, listStudents, updateStudent } from '../services/studentService';

export const getStudentsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = paginationSchema.parse(req.query);
  const data = await listStudents({ page, limit, search, sortBy, sortOrder });

  res.status(200).json({ data: data.students, meta: data.meta });
});

export const getStudentController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const student = await getStudentById(id);

  res.status(200).json({ data: student });
});

export const createStudentController = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createStudentSchema.parse({ body: req.body }).body;
  const student = await createStudent(parsed);

  res.status(201).json({ message: 'Student created successfully', data: student });
});

export const updateStudentController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const parsed = updateStudentSchema.parse({ body: req.body }).body;
  const student = await updateStudent(id, parsed);

  res.status(200).json({ message: 'Student updated successfully', data: student });
});

export const deleteStudentController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await deleteStudent(id);
  res.status(204).send();
});