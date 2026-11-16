
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  LogOut,
  X,
} from "lucide-react";

export type PageType = "overview" | "deals" | "approvals" | "invoices";

type SidebarProps = {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  onLogout: () => void;
  user: any;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

const navigation: {
  label: string;
  page: PageType;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Overview", page: "overview", icon: LayoutDashboard },
  { label: "Deals", page: "deals", icon: BriefcaseBusiness },
  { label: "Approvals", page: "approvals", icon: ClipboardCheck },
  { label: "Invoices", page: "invoices", icon: FileText },
];

export default function Sidebar({
  activePage,
  setActivePage,
  onLogout,
  user,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const role = user?.roleId?.name || "User";

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600 p-2 text-white">
            <BriefcaseBusiness size={21} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            DealDesk
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(false)}
          className="text-slate-500 hover:text-slate-900 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={21} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-7">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map(({ label, page, icon: Icon }) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                activePage === page
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg p-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="truncate text-xs capitalize text-slate-500">
              {role.split("_").join(" ")}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
