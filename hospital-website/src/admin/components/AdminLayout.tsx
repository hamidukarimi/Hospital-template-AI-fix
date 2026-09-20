import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  ShieldCheck,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type { AdminUser } from "../types/admin";
import { adminIconMap } from "../utils/adminHelpers";

const menuGroups = [
  {
    title: "Dashboard",
    items: [
      { to: "/admin", label: "Dashboard", icon: adminIconMap.settings },
      { to: "/admin/services", label: "Services", icon: adminIconMap.service },
      { to: "/admin/doctors", label: "Doctors", icon: adminIconMap.doctor },
      { to: "/admin/articles", label: "Articles", icon: adminIconMap.article },
      {
        to: "/admin/testimonials",
        label: "Testimonials",
        icon: adminIconMap.testimonial,
      },
      { to: "/admin/help-cards", label: "Help Cards", icon: adminIconMap.help },
      {
        to: "/admin/why-choose-us",
        label: "Why Choose Us",
        icon: adminIconMap.why,
      },
      { to: "/admin/lab-tests", label: "Lab Tests", icon: adminIconMap.lab },
    ],
  },
  {
    title: "Website",
    items: [
      {
        to: "/admin/site-settings",
        label: "Site Settings",
        icon: adminIconMap.settings,
      },
      {
        to: "/admin/social-media",
        label: "Social Media",
        icon: adminIconMap.social,
      },
      {
        to: "/admin/footer-settings",
        label: "Footer Settings",
        icon: adminIconMap.settings,
      },
      {
        to: "/admin/footer-columns",
        label: "Footer Columns",
        icon: adminIconMap.article,
      },
      {
        to: "/admin/footer-links",
        label: "Footer Links",
        icon: adminIconMap.link,
      },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/admin/profile", label: "Profile", icon: adminIconMap.profile },
    ],
  },
];

const getAdminUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem("adminUser");
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
};

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() =>
    getAdminUser(),
  );

  useEffect(() => {
    setAdminUser(getAdminUser());
  }, [location.pathname]);

  const currentTitle = useMemo(() => {
    const matchingItem = menuGroups
      .flatMap((group) => group.items)
      .find(
        (item) =>
          location.pathname === item.to ||
          location.pathname.startsWith(`${item.to}/`),
      );

    return matchingItem?.label || "Dashboard";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-[#111111] text-white lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#147BD5] text-lg font-bold text-white">
              A
            </div>
            <div>
              <p className="text-lg font-semibold">Aura Hospital</p>
              <p className="text-xs text-slate-300">Admin CMS</p>
            </div>
          </div>

          <nav className="flex-1 space-y-6 px-4 py-5">
            {menuGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {group.title}
                </p>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/admin"}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                            isActive
                              ? "bg-[#147BD5] text-white shadow-md"
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                          ].join(" ")
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-screen min-w-0 flex-1 flex-col"
        >
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6 xl:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Administration
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentTitle}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#147BD5] text-sm font-semibold text-white">
                    {adminUser?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-slate-900">
                      {adminUser?.name || "Admin"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {adminUser?.role || "ADMIN"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/admin/profile"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900"
                  aria-label="Profile"
                >
                  <UserCircle2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 md:px-6 xl:px-8">
            <Outlet />
          </main>
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex h-full max-h-[100dvh] w-72 flex-col bg-[#111111] p-4 text-white"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#147BD5] font-bold text-white">
                    A
                  </div>
                  <div>
                    <p className="font-semibold">Aura Hospital</p>
                    <p className="text-xs text-slate-400">Admin CMS</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pr-1">
                {menuGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {group.title}
                    </p>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            end={item.to === "/admin"}
                            className={({ isActive }) =>
                              [
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                                isActive
                                  ? "bg-[#147BD5] text-white"
                                  : "text-slate-300 hover:bg-white/5 hover:text-white",
                              ].join(" ")
                            }
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Logout
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
