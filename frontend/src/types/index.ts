export type Gender = 'MALE' | 'FEMALE';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ClassRecord {
  id: string;
  name: string;
  section: string;
  capacity: number;
  createdAt: string;
  _count?: {
    students: number;
  };
}

export interface StudentRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  classId: string;
  createdAt: string;
  class: ClassRecord;
}

export interface DashboardSummary {
  totalStudents: number;
  totalClasses: number;
  maleStudents: number;
  femaleStudents: number;
  recentStudents: StudentRecord[];
}

export interface PaginatedStudents {
  data: StudentRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}