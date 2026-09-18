import { LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { getCurrentAdmin } from "../services/adminApi";
import type { AdminUser } from "../types/admin";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const result = await getCurrentAdmin();
        setUser(result as AdminUser);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login", { replace: true });
  };

  if (loading) return <LoadingState label="Loading profile..." />;
  if (error) return <ErrorState title="Profile unavailable" message={error} />;
  if (!user)
    return (
      <ErrorState
        title="No profile found"
        message="Your admin profile could not be loaded."
      />
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#147BD5] text-2xl font-bold text-white">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {user.name || "Admin"}
              </h1>
              <p className="text-sm text-slate-500">Hospital administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <UserRound className="h-4 w-4" />
            <p className="text-sm font-medium">Name</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {user.name}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <Mail className="h-4 w-4" />
            <p className="text-sm font-medium">Email</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {user.email}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-sm font-medium">Role</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
