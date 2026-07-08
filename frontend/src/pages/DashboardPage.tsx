import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses';
import { useDashboard } from '../hooks/useDashboard';
import { useStudents } from '../hooks/useStudents';
import {
  Badge,
  Card,
  CubeIcon,
  EmptyState,
  FemaleIcon,
  LoadingState,
  MaleIcon,
  Select,
  StatCard,
  UsersIcon,
} from '../components/ui';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { ClassRecord, StudentRecord } from '../types';

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getClassLabel = (classRecord?: ClassRecord) => (classRecord ? `${classRecord.name} - ${classRecord.section}` : 'No class selected');
const isDark = document.documentElement.classList.contains("dark");

const buildActivityData = (students: StudentRecord[]) => {
  const counts = Array(12).fill(0);

  students.forEach((student) => {
    const date = new Date(student.createdAt);

    if (!Number.isNaN(date.getTime())) {
      counts[date.getMonth()]++;
    }
  });

  return monthLabels.map((month, index) => ({
    month,
    Enrollments: counts[index],
  }));
};

const Gauge = ({ value, className }: { value: number; className: string }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 72;
  const dashArray = Math.PI * radius;
  const dashOffset = dashArray - (dashArray * clamped) / 100;

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col items-center">
      <svg viewBox="0 0 200 140" className="w-full overflow-visible">
        <path d="M 28 100 A 72 72 0 0 1 172 100" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 28 100 A 72 72 0 0 1 172 100"
          fill="none"
          className="stroke-sky-600 dark:stroke-sky-400"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="-mt-6 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">{clamped.toFixed(2)}%</div>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
        {className}
      </div>
    </div>
  );
};

const Chart = ({
  data,
}: {
  data: ReturnType<typeof buildActivityData>;
}) => (
  <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Student Enrollments
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Monthly enrollment activity
      </p>
    </div>

    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            cursor={{
              fill: isDark
                ? "rgba(56,189,248,0.12)"
                : "rgba(2,132,199,0.08)",
            }}
            contentStyle={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
              borderRadius: 12,
            }}
            labelStyle={{
              color: isDark ? "#f8fafc" : "#0f172a",
            }}
            itemStyle={{
              color: isDark ? "#7dd3fc" : "#0284c7",
            }}
          />

          <Bar
            dataKey="Enrollments"
            fill="url(#enrollmentGradient)"
            radius={[10, 10, 0, 0]}
            maxBarSize={40}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard();
  const { data: classes = [] } = useClasses();
  const studentsQuery = useStudents({ page: 1, limit: 50, search: '' });
  const [selectedClassId, setSelectedClassId] = useState('');
  const activityStudents = studentsQuery.data?.data ?? data?.recentStudents ?? [];
  const activityBars = useMemo(() => buildActivityData(activityStudents), [activityStudents]);
  const selectedClass = useMemo(() => classes.find((classRecord) => classRecord.id === selectedClassId) ?? classes[0], [classes, selectedClassId]);
  const enrolled = selectedClass?._count?.students ?? 0;
  const capacity = selectedClass?.capacity ?? 0;
  const capacityPercent = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;

  if (isLoading) {
    return <LoadingState label="Loading dashboard summary..." />;
  }

  if (isError || !data) {
    return <EmptyState title="Dashboard unavailable" description="We could not load the overview data right now." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={data.totalStudents}
          helper="All registered students"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          label="Total Classes"
          value={data.totalClasses}
          helper="Active academic classes"
          icon={<CubeIcon className="h-6 w-6" />}
        />
        <StatCard
          label="Male Students"
          value={data.maleStudents}
          helper="Currently enrolled"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          label="Female Students"
          value={data.femaleStudents}
          helper="Currently enrolled"
          icon={<UsersIcon className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
        <Card className="overflow-hidden p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Monthly Activity</h2>
              <p className="mt-2 text-sm text-slate-500">Enrollment activity across the current academic year.</p>
            </div>
          </div>

          <Chart data={activityBars} />
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 px-6 pt-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Class Capacity</h2>
              <p className="mt-2 text-sm text-slate-500">Select a class to view its current fill rate.</p>
            </div>
            <div className="w-full sm:w-56">
              <Select value={selectedClass?.id ?? ''} onChange={(event) => setSelectedClassId(event.target.value)} disabled={classes.length === 0}>
                {classes.length === 0 ? <option value="">No classes</option> : null}
                {classes.map((classRecord) => (
                  <option key={classRecord.id} value={classRecord.id}>
                    {getClassLabel(classRecord)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="px-6 pb-6 pt-10">
            <Gauge value={capacityPercent} className={getClassLabel(selectedClass)} />
            <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-7 text-slate-500">
              {enrolled} of {capacity} seats are filled in this class.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/80 dark:divide-white/10 dark:border-white/10 dark:bg-slate-950/70">
            <div className="px-4 py-5 text-center">
              <div className="text-sm text-slate-500">Capacity</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{capacity}</div>
            </div>
            <div className="px-4 py-5 text-center">
              <div className="text-sm text-slate-500">Enrolled</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{enrolled}</div>
            </div>
            <div className="px-4 py-5 text-center">
              <div className="text-sm text-slate-500">Open Seats</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{Math.max(0, capacity - enrolled)}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Recent Students</h2>
            <p className="mt-2 text-sm text-slate-500">Latest enrolments across the system</p>
          </div>
          <Link to="/students" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
            View all students
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-900">
              {data.recentStudents.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    <Link to={`/students/${student.id}`} className="hover:text-sky-600">
                      {student.fullName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{student.email}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{student.class.name} - {student.class.section}</td>
                  <td className="px-6 py-4">
                    <Badge tone={student.gender === 'MALE' ? 'sky' : 'accent'}>{student.gender}</Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{formatDate(student.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
