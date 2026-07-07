import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export const listClasses = async () => {
  return prisma.class.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { students: true },
      },
    },
  });
};

export const createClass = async (data: { name: string; section: string; capacity: number }) => {
  return prisma.class.create({ data });
};

export const updateClass = async (
  id: string,
  data: Partial<{ name: string; section: string; capacity: number }>,
) => {
  const existingClass = await prisma.class.findUnique({ where: { id } });
  if (!existingClass) {
    throw new AppError(404, 'Class not found');
  }

  return prisma.class.update({ where: { id }, data });
};

export const deleteClass = async (id: string) => {
  const existingClass = await prisma.class.findUnique({ where: { id } });
  if (!existingClass) {
    throw new AppError(404, 'Class not found');
  }

  await prisma.class.delete({ where: { id } });
};