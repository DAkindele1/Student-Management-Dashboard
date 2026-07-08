import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useClasses } from '../hooks/useClasses';
import { useDashboard } from '../hooks/useDashboard';
import {
  BellIcon,
  ChevronDownIcon,
  CubeIcon,
  GridIcon,
  LayoutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UsersIcon,
} from '../components/ui';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutIcon },
  { to: '/students', label: 'Students', icon: UsersIcon },
  { to: '/classes', label: 'Classes', icon: CubeIcon },
];

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { data: dashboard } = useDashboard();
  const { data: classes = [] } = useClasses();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('student-hub-theme') === 'dark');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const closeMobileNav = () => setIsMobileNavOpen(false);
  const toggleTheme = () => setIsDarkMode((current) => !current);
  const recentChanges = useMemo(() => {
    const studentChanges =
      dashboard?.recentStudents.map((student) => ({
        id: `student-${student.id}`,
        label: `${student.fullName} was enrolled`,
        detail: `${student.class.name} - ${student.class.section}`,
        date: student.createdAt,
      })) ?? [];

    const classChanges = classes.map((classRecord) => ({
      id: `class-${classRecord.id}`,
      label: `${classRecord.name} - ${classRecord.section} was created`,
      detail: `${classRecord._count?.students ?? 0} students enrolled`,
      date: classRecord.createdAt,
    }));

    return [...studentChanges, ...classChanges]
      .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
      .slice(0, 6);
  }, [classes, dashboard?.recentStudents]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('student-hub-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sidebarContent = (collapsed = false) => (
    <>
      <Link to="/dashboard" className={`flex items-center gap-3 rounded-[24px] px-2 py-2 ${collapsed ? 'justify-center' : ''}`} onClick={closeMobileNav}>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#4f6df5] text-white">
          <GridIcon className="h-6 w-6" />
        </div>
        <div className={collapsed ? 'hidden' : ''}>
          <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Student Hub</div>
        </div>
      </Link>

      <div className="mt-10 space-y-6">
        <div>
          <div className={`px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 ${collapsed ? 'sr-only' : ''}`}>Menu</div>
          <nav className="mt-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileNav}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 text-[15px] font-medium transition ${collapsed ? 'justify-center' : ''} ${
                      isActive
                        ? 'rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300'
                        : 'rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className={collapsed ? 'sr-only' : ''}>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1900px]">
        <aside className={`hidden shrink-0 flex-col border-r border-slate-200/80 bg-white px-5 py-6 transition-[width] duration-200 dark:border-white/10 dark:bg-slate-950 lg:flex ${isSidebarCollapsed ? 'w-[92px]' : 'w-[290px]'}`}>
          {sidebarContent(isSidebarCollapsed)}
        </aside>

        {isMobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="Close navigation" onClick={closeMobileNav} />
            <aside className="relative flex h-full w-[min(82vw,320px)] flex-col border-r border-slate-200 bg-white px-5 py-6 dark:border-white/10 dark:bg-slate-950">
              {sidebarContent(false)}
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
            <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <button type="button" className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:hidden" aria-label="Open navigation" onClick={() => setIsMobileNavOpen(true)}>
                <MenuIcon />
              </button>

              <button
                type="button"
                className="hidden h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 lg:inline-flex"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setIsSidebarCollapsed((current) => !current)}
              >
                <MenuIcon />
              </button>

              <div className="hidden lg:block">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Student Management Dashboard</h1>
              </div>

              <div className="ml-auto flex min-w-0 items-center justify-end gap-3">
                <button type="button" className="hidden h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white sm:inline-flex" aria-label="Toggle theme" onClick={toggleTheme}>
                  {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>

                <div className="relative" ref={notificationsRef}>
                  <button
                    type="button"
                    className="relative hidden h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:inline-flex"
                    aria-label="Notifications"
                    aria-haspopup="menu"
                    aria-expanded={isNotificationsOpen}
                    onClick={() => setIsNotificationsOpen((current) => !current)}
                  >
                    <BellIcon />
                    {recentChanges.length > 0 ? <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-orange-400" /> : null}
                  </button>

                  {isNotificationsOpen ? (
                    <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" role="menu">
                      <div className="border-b border-slate-100 px-4 py-3 dark:border-white/10">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Recent changes</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Latest database activity</div>
                      </div>
                      {recentChanges.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto py-2">
                          {recentChanges.map((change) => (
                            <div key={change.id} className="rounded-2xl px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5" role="menuitem">
                              <div className="font-medium text-slate-900 dark:text-white">{change.label}</div>
                              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{change.detail}</div>
                              <div className="mt-1 text-xs text-slate-400">{new Date(change.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">No recent changes yet.</div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 pr-4 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                    aria-label="User menu"
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                    onClick={() => setIsProfileMenuOpen((current) => !current)}
                  >
                    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_top,_#dbeafe,_#e2e8f0)] text-sm font-semibold text-slate-800">
                      {user?.name?.slice(0, 1)?.toUpperCase() ?? 'A'}
                    </div>
                    <div className="hidden min-w-0 text-left sm:block">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name ?? 'Admin'}</div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email ?? 'admin@school.com'}</div>
                    </div>
                    <ChevronDownIcon className={`text-slate-500 transition dark:text-slate-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen ? (
                    <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" role="menu">
                      <div className="border-b border-slate-100 px-4 py-3 dark:border-white/10">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name ?? 'Admin'}</div>
                        <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{user?.email ?? 'admin@school.com'}</div>
                      </div>
                      <button
                        type="button"
                        className="mt-1 flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        onClick={logout}
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1500px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
