import { motion } from "framer-motion";
import {
  Activity,
  BriefcaseMedical,
  FileText,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatCard } from "../components/StatCard";
import { getDashboardStats } from "../services/adminApi";
import type { DashboardStats } from "../types/admin";

const statConfig = [
  {
    key: "services",
    label: "Services",
    description: "Active care offerings",
    icon: BriefcaseMedical,
  },
  {
    key: "doctors",
    label: "Doctors",
    description: "Clinical specialists",
    icon: Stethoscope,
  },
  {
    key: "articles",
    label: "Articles",
    description: "Published health content",
    icon: FileText,
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Patient feedback",
    icon: HeartPulse,
  },
  {
    key: "helpCards",
    label: "Help Cards",
    description: "Support guidance",
    icon: ShieldCheck,
  },
  {
    key: "whyChooseUs",
    label: "Why Choose Us",
    description: "Brand highlights",
    icon: Activity,
  },
  {
    key: "labTests",
    label: "Lab Tests",
    description: "Diagnostic packages",
    icon: Microscope,
  },
  {
    key: "socialMedia",
    label: "Social Media",
    description: "Connected channels",
    icon: Users,
  },
] as const;

const quickActions = [
  { label: "Add Service", to: "/admin/services/new" },
  { label: "Add Doctor", to: "/admin/doctors/new" },
  { label: "Write Article", to: "/admin/articles/new" },
  { label: "Add Testimonial", to: "/admin/testimonials/new" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (dashboardError) {
        setError(
          dashboardError instanceof Error
            ? dashboardError.message
            : "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const summary = useMemo(() => {
    if (!stats) return [];

    return statConfig.map((item) => ({
      ...item,
      value: stats[item.key],
    }));
  }, [stats]);

  if (loading) {
    return <LoadingState label="Loading dashboard metrics..." />;
  }

  if (error) {
    return <ErrorState title="Dashboard unavailable" message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#147BD5]">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Hospital dashboard
          </h1>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.label}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {action.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Open management page
                </p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-[#111111] p-6 text-white shadow-sm"
        >
          <h2 className="text-xl font-bold">Operations at a glance</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span>Website settings</span>
              <Link to="/admin/site-settings" className="text-[#147BD5]">
                Manage
              </Link>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span>Footer content</span>
              <Link to="/admin/footer-settings" className="text-[#147BD5]">
                Update
              </Link>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span>Social channels</span>
              <Link to="/admin/social-media" className="text-[#147BD5]">
                Review
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
