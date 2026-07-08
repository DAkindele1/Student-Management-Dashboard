import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses';
import { useCreateStudent, useDeleteStudent, useStudents, useUpdateStudent } from '../hooks/useStudents';
import { useToast } from '../hooks/useToast';
import { Badge, Button, Card, ConfirmDialog, EmptyState, Input, LoadingState, Modal, Pagination } from '../components/ui';
import { StudentForm, type StudentFormValues } from '../features/students/StudentForm';
import type { StudentRecord } from '../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 8;

const toDefaultValues = (student: StudentRecord) => ({
  fullName: student.fullName,
  email: student.email,
  phone: student.phone,
  gender: student.gender,
  dateOfBirth: student.dateOfBirth.slice(0, 10),
  classId: student.classId,
});

export const StudentsPage = () => {
  const { data: classOptions = [] } = useClasses();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { showToast } = useToast();
  const studentsQuery = useStudents({ page, limit: PAGE_SIZE, search });
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const students = studentsQuery.data?.data ?? [];
  const meta = studentsQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const activeFormStudent = useMemo(() => studentToEdit, [studentToEdit]);
  const exportToCsv = () => {
    const headers = [
      'Student',
      'Email',
      'Phone',
      'Gender',
      'Class',
    ];

    const rows = sortedStudents.map((student) => [
      student.fullName,
      student.email,
      student.phone,
      student.gender,
      `${student.class.name} - ${student.class.section}`,
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `students-${new Date().toISOString().split('T')[0]}.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleCreate = async (values: StudentFormValues) => {
    try {
      await createStudent.mutateAsync(values);
      showToast({ tone: 'success', title: 'Student created', description: `${values.fullName} was added successfully.` });
      setIsCreateOpen(false);
    } catch (error) {
      showToast({ tone: 'error', title: 'Create failed', description: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

  const handleUpdate = async (values: StudentFormValues) => {
    if (!activeFormStudent) return;

    try {
      await updateStudent.mutateAsync({ id: activeFormStudent.id, payload: values });
      showToast({ tone: 'success', title: 'Student updated', description: `${values.fullName} was updated successfully.` });
      setStudentToEdit(null);
    } catch (error) {
      showToast({ tone: 'error', title: 'Update failed', description: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      await deleteStudent.mutateAsync(studentToDelete.id);
      showToast({ tone: 'success', title: 'Student deleted', description: `${studentToDelete.fullName} has been removed.` });
      setStudentToDelete(null);
    } catch (error) {
      showToast({ tone: 'error', title: 'Delete failed', description: error instanceof Error ? error.message : 'Please try again.' });
    }
  };
  const [sortConfig, setSortConfig] = useState<{
  key: string;
  direction: SortDirection;
}>({
  key: 'fullName',
  direction: 'asc',
});

const handleSort = (key: string) => {
  setSortConfig((prev) => ({
    key,
    direction:
      prev.key === key && prev.direction === 'asc'
        ? 'desc'
        : 'asc',
  }));
};

  const sortedStudents = useMemo(() => {
  const data = [...students];

  data.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortConfig.key) {
      case 'fullName':
        aValue = a.fullName;
        bValue = b.fullName;
        break;

      case 'email':
        aValue = a.email;
        bValue = b.email;
        break;

      case 'phone':
        aValue = a.phone;
        bValue = b.phone;
        break;

      case 'gender':
        aValue = a.gender;
        bValue = b.gender;
        break;

      case 'class':
        aValue = `${a.class.name} ${a.class.section}`;
        bValue = `${b.class.name} ${b.class.section}`;
        break;

      default:
        return 0;
    }

    if (typeof aValue === 'string') {
      const result = aValue.localeCompare(bValue);

      return sortConfig.direction === 'asc'
        ? result
        : -result;
    }

    return sortConfig.direction === 'asc'
      ? aValue - bValue
      : bValue - aValue;
  });

  return data;
}, [students, sortConfig]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Students</h2>
          <p className="mt-1 text-sm text-slate-500">Search, create, edit, and remove students from the roster.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search by name, email, or phone" onKeyDown={(event) => event.key === 'Enter' && handleSearch()} />
          <Button variant="secondary" onClick={handleSearch}>Search</Button>
          <Button onClick={() => setIsCreateOpen(true)}>Add Student</Button>
          <Button variant="secondary" onClick={exportToCsv}>Export CSV</Button>
        </div>
      </div>

      {studentsQuery.isLoading ? (
        <LoadingState label="Loading students..." />
      ) : students.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Try a different search term or create the first student."
          action={<Button onClick={() => setIsCreateOpen(true)}>Create student</Button>}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    <button
                      onClick={() => handleSort('fullName')}
                      className="flex items-center gap-1 font-semibold hover:text-sky-600"
                    >
                      Student
                      {sortConfig.key === 'fullName' &&
                        (sortConfig.direction === 'asc'
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">                   
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 font-semibold hover:text-sky-600"
                    >
                      Email
                      {sortConfig.key === 'email' &&
                        (sortConfig.direction === 'asc'
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">                   
                    <button
                      onClick={() => handleSort('phone')}
                      className="flex items-center gap-1 font-semibold hover:text-sky-600"
                    >
                      Phone
                      {sortConfig.key === 'phone' &&
                        (sortConfig.direction === 'asc'
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">                   
                    <button
                      onClick={() => handleSort('gender')}
                      className="flex items-center gap-1 font-semibold hover:text-sky-600"
                    >
                      Gender
                      {sortConfig.key === 'gender' &&
                        (sortConfig.direction === 'asc'
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">                   
                    <button
                      onClick={() => handleSort('class')}
                      className="flex items-center gap-1 font-semibold hover:text-sky-600"
                    >
                      Class
                      {sortConfig.key === 'class' &&
                        (sortConfig.direction === 'asc'
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-900">
                {sortedStudents.map((student) => (
                  <tr key={student.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <Link className="hover:text-sky-600" to={`/students/${student.id}`}>{student.fullName}</Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{student.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{student.phone}</td>
                    <td className="px-6 py-4"><Badge tone={student.gender === 'MALE' ? 'sky' : 'accent'}>{student.gender}</Badge></td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{student.class.name} - {student.class.section}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setStudentToEdit(student)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => setStudentToDelete(student)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={isCreateOpen} title="Create Student" description="Add a new student record to the system." onClose={() => setIsCreateOpen(false)}>
        <StudentForm
          title="New Student"
          description="Enter the student's personal information and class assignment."
          classes={classOptions}
          submitLabel="Create Student"
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
          isSubmitting={createStudent.isPending}
        />
      </Modal>

      <Modal open={Boolean(activeFormStudent)} title="Edit Student" description="Update the student's record." onClose={() => setStudentToEdit(null)}>
        {activeFormStudent ? (
          <StudentForm
            title={activeFormStudent.fullName}
            description="Modify the student's details and save the change."
            classes={classOptions}
            defaultValues={toDefaultValues(activeFormStudent)}
            submitLabel="Save Changes"
            onCancel={() => setStudentToEdit(null)}
            onSubmit={handleUpdate}
            isSubmitting={updateStudent.isPending}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(studentToDelete)}
        title="Delete student"
        description={`Are you sure you want to delete ${studentToDelete?.fullName ?? 'this student'}? This cannot be undone.`}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};