import { Link, useParams } from 'react-router-dom';
import { useStudent } from '../hooks/useStudents';
import { Badge, Card, EmptyState, LoadingState } from '../components/ui';

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export const StudentDetailsPage = () => {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useStudent(id);

  if (isLoading) {
    return <LoadingState label="Loading student details..." />;
  }

  if (isError || !data) {
    return <EmptyState title="Student not found" description="The selected student could not be loaded." action={<Link to="/students" className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-200">Back to students</Link>} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/students" className="text-sm font-medium text-sky-600 hover:text-sky-700">Back to students</Link>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{data.fullName}</h2>
          <p className="mt-2 text-sm text-slate-500">Student profile and assigned class information</p>
        </div>
        <Badge tone={data.gender === 'MALE' ? 'sky' : 'accent'}>{data.gender}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">Full Name</dt><dd className="font-medium text-slate-900">{data.fullName}</dd></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{data.email}</dd></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">Phone</dt><dd className="font-medium text-slate-900">{data.phone}</dd></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">Date of Birth</dt><dd className="font-medium text-slate-900">{formatDate(data.dateOfBirth)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Date Created</dt><dd className="font-medium text-slate-900">{formatDate(data.createdAt)}</dd></div>
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Assigned Class</h3>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Class</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{data.class.name} - {data.class.section}</div>
            <div className="mt-2 text-sm text-slate-500">Capacity: {data.class.capacity}</div>
          </div>
        </Card>
      </div>
    </div>
  );
};