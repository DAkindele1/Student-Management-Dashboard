import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

type Gender = 'MALE' | 'FEMALE';

export const listStudents = async (params: { page: number; limit: number; search: string }) => {
  const { page, limit, search } = params;
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : undefined;

  const [total, students] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { class: true },
    }),
  ]);

  return {
    students,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getStudentById = async (id: string) => {
  const student = await prisma.student.findUnique({
    where: { id },
    include: { class: true },
  });

  if (!student) {
    throw new AppError(404, 'Student not found');
  }

  return student;
};

export const createStudent = async (data: {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: Date;
  classId: string;
}) => {
  const classRecord = await prisma.class.findUnique({ where: { id: data.classId } });
  if (!classRecord) {
    throw new AppError(404, 'Class not found');
  }

  const currentCount = await prisma.student.count({ where: { classId: data.classId } });
  if (currentCount >= classRecord.capacity) {
    throw new AppError(400, 'Class capacity has been reached');
  }

  return prisma.student.create({
    data,
    include: { class: true },
  });
};

export const updateStudent = async (
  id: string,
  data: Partial<{
    fullName: string;
    email: string;
    phone: string;
    gender: Gender;
    dateOfBirth: Date;
    classId: string;
  }>,
) => {
  const existingStudent = await prisma.student.findUnique({ where: { id } });
  if (!existingStudent) {
    throw new AppError(404, 'Student not found');
  }

  if (data.classId) {
    const classRecord = await prisma.class.findUnique({ where: { id: data.classId } });
    if (!classRecord) {
      throw new AppError(404, 'Class not found');
    }

    const currentCount = await prisma.student.count({ where: { classId: data.classId } });
    const movingFromSameClass = existingStudent.classId === data.classId;
    if (!movingFromSameClass && currentCount >= classRecord.capacity) {
      throw new AppError(400, 'Class capacity has been reached');
    }
  }

  return prisma.student.update({
    where: { id },
    data,
    include: { class: true },
  });
};

export const deleteStudent = async (id: string) => {
  const existingStudent = await prisma.student.findUnique({ where: { id } });
  if (!existingStudent) {
    throw new AppError(404, 'Student not found');
  }

  await prisma.student.delete({ where: { id } });
};