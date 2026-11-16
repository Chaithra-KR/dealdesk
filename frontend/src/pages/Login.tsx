import { useState, type FormEvent } from "react";
import { ArrowRight, BriefcaseBusiness, LockKeyhole, Mail } from "lucide-react";
import api from "../services/api";

type LoginProps = {
  onLogin: (user: any) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("sales@dealdesk.com");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      onLogin(user);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <section className="flex items-center justify-center px-7 py-14 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-10 md:hidden">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-600 p-3 text-white">
                  <BriefcaseBusiness size={23} />
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  DealDesk
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500 p-3 text-white">
                <BriefcaseBusiness size={25} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                DealDesk
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access your workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                  <LockKeyhole size={18} className="text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Secure access to your DealDesk workspace
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
