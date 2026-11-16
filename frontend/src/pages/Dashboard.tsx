
import {
  BriefcaseBusiness,
  Clock3,
  FileText,
  Menu,
  Plus,
  CheckCircle2,
} from "lucide-react";
import type { PageType } from "../components/Sidebar";

type DashboardProps = {
  user: any;
  activePage: PageType;
  setMobileOpen: (open: boolean) => void;
};

const stats = [
  {
    label: "Total Deals",
    value: "0",
    note: "No deals created yet",
    icon: BriefcaseBusiness,
  },
  {
    label: "Pending Approvals",
    value: "0",
    note: "Nothing awaiting approval",
    icon: Clock3,
  },
  {
    label: "Invoices",
    value: "0",
    note: "No invoices generated",
    icon: FileText,
  },
  {
    label: "Completed",
    value: "0",
    note: "No completed deals yet",
    icon: CheckCircle2,
  },
];

const pageDetails: Record<
  PageType,
  { title: string; description: string }
> = {
  overview: {
    title: "Overview",
    description: "Here's what's happening in your workspace today.",
  },
  deals: {
    title: "Deals",
    description: "Create and manage your customer deals.",
  },
  approvals: {
    title: "Approvals",
    description: "Review and manage pending approval requests.",
  },
  invoices: {
    title: "Invoices",
    description: "Track and manage customer invoices.",
  },
};

export default function Dashboard({
  user,
  activePage,
  setMobileOpen,
}: DashboardProps) {
  const currentPage = pageDetails[activePage];

  return (
    <main className="min-h-screen bg-slate-50 lg:ml-64">

      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {currentPage.title}
            </h1>
            <p className="text-xs text-slate-500">
              DealDesk / {currentPage.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500">
              {user?.email}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-5 sm:p-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Welcome back,
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {user?.name || "User"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {currentPage.description}
            </p>
          </div>

          {activePage === "deals" && (
            <button className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">
              <Plus size={17} />
              Create Deal
            </button>
          )}
        </div>

        {activePage === "overview" ? (
          <>
            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, note, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {label}
                    </p>

                    <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-3xl font-semibold text-slate-900">
                    {value}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {note}
                  </p>
                </div>
              ))}
            </div>

            {/* Dashboard Sections */}
            <div className="mt-6 grid gap-5 xl:grid-cols-3">

              {/* Recent Activity */}
              <section className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Recent Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest updates across your workspace.
                  </p>
                </div>

                <div className="flex min-h-52 flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-slate-100 p-3">
                    <Clock3 size={23} className="text-slate-400" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-700">
                    No activity yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Your recent deals and updates will appear here.
                  </p>
                </div>
              </section>

              {/* Quick Overview */}
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  Quick Overview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your workspace at a glance.
                </p>

                <div className="mt-6 space-y-5">
                  {[
                    ["Deals", "Manage sales opportunities"],
                    ["Approvals", "Review discount requests"],
                    ["Invoices", "Track billing activity"],
                  ].map(([title, description]) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BriefcaseBusiness size={25} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {currentPage.title}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              This section is ready for implementation. Its features and
              data will be connected as the application develops.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
