import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/adminApi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@aurahospital.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);

      localStorage.setItem("adminToken", result.token);
      localStorage.setItem("adminUser", JSON.stringify(result.admin));

      navigate("/admin", { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff9db,_#f5f7fb_46%,_#eef2f7)] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.1)] md:p-8"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#147BD5] text-2xl font-bold text-white">
            A
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Aura Hospital</h1>
          <p className="mt-2 text-sm text-slate-500">Admin dashboard access</p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Secure hospital admin portal
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@aurahospital.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#147BD5] focus:bg-white focus:ring-4 focus:ring-[#147BD5]/15"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#147BD5] focus:bg-white focus:ring-4 focus:ring-[#147BD5]/15"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
