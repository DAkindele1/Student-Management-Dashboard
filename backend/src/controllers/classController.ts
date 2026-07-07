import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { createClassSchema, updateClassSchema } from '../validators/classValidator';
import { createClass, deleteClass, listClasses, updateClass } from '../services/classService';

export const getClassesController = asyncHandler(async (_req: Request, res: Response) => {
  const classes = await listClasses();
  res.status(200).json({ data: classes });
});

export const createClassController = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createClassSchema.parse({ body: req.body }).body;
  const classRecord = await createClass(parsed);
  res.status(201).json({ message: 'Class created successfully', data: classRecord });
});

export const updateClassController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const parsed = updateClassSchema.parse({ body: req.body }).body;
  const classRecord = await updateClass(id, parsed);
  res.status(200).json({ message: 'Class updated successfully', data: classRecord });
});

export const deleteClassController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await deleteClass(id);
  res.status(204).send();
});