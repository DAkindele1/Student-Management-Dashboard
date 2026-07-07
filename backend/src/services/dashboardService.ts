import { prisma } from '../prisma/client';

export const getDashboardSummary = async () => {
  const [totalStudents, totalClasses, maleStudents, femaleStudents, recentStudents] = await Promise.all([
    prisma.student.count(),
    prisma.class.count(),
    prisma.student.count({ where: { gender: 'MALE' } }),
    prisma.student.count({ where: { gender: 'FEMALE' } }),
    prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        class: true,
      },
    }),
  ]);

  return {
    totalStudents,
    totalClasses,
    maleStudents,
    femaleStudents,
    recentStudents,
  };
};