
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sidebar, { type PageType } from "./components/Sidebar";

type User = {
  _id: string;
  name: string;
  email: string;
  roleId?: {
    name: string;
    permissions?: string[];
    scope?: string;
  };
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<PageType>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActivePage("overview");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMobileOpen(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        user={user}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Dashboard
        user={user}
        activePage={activePage}
        setMobileOpen={setMobileOpen}
      />
    </div>
  );
}
