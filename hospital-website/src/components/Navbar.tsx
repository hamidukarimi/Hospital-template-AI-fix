import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronDown, Menu, Phone, UserRound, X } from "lucide-react";
import { getImageUrl } from "../lib/api";
import type { SiteSettings } from "../types/api";

interface MenuItem {
  label: string;
  items: string[];
}

const menuItems: MenuItem[] = [
  {
    label: "Home",
    items: ["Home Option 1", "Home Option 2", "Home Option 3"],
  },
  {
    label: "Patients & Visitors",
    items: ["Visiting Hours", "Patient Guide", "Patient Resources"],
  },
  {
    label: "Areas of Care",
    items: ["Medical Care", "Surgical Care", "Specialized Care"],
  },
  {
    label: "Education & Research",
    items: ["Education", "Research", "Training"],
  },
  {
    label: "About Us",
    items: ["Our Hospital", "Our Team", "Leadership"],
  },
  {
    label: "Pages",
    items: ["Services", "Contact", "FAQ"],
  },
];

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

interface NavbarProps {
  siteSettings?: SiteSettings | null;
  isLoading?: boolean;
}

const Navbar = ({
  siteSettings,
  isLoading: _isLoading = false,
}: NavbarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const navbarRef = useRef<HTMLElement>(null);
  const hospitalName = siteSettings?.hospitalName || "Ali Hospital";
  const logoSrc = siteSettings?.logo
    ? getImageUrl(siteSettings.logo)
    : "./h-logo.svg";
  const emergencyPhone = siteSettings?.phone || "+011 3253 4567";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        setMobileDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdown((current) => (current === label ? null : label));
  };

  return (
    <nav
      ref={navbarRef}
      className="fixed top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center rounded-2xl bg-white px-4 py-3 shadow-[0_0_35px_rgba(124,58,237,0.15)] sm:px-5 lg:px-6">
        <a
          href="/"
          aria-label={`${hospitalName} home`}
          className="flex shrink-0 items-center"
        >
          <img
            src={logoSrc}
            alt={hospitalName}
            className="w-[40px] sm:w-[40px] lg:w-[50px]"
          />
        </a>

        <div className="ml-auto hidden min-w-0 items-center xl:flex">
          {menuItems.map((menu) => {
            const isOpen = activeDropdown === menu.label;
            const isActive = menu.label === "Home";

            return (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(menu.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : menu.label)}
                  className={`group flex cursor-pointer items-center gap-1 whitespace-nowrap px-2 py-3 text-[13px] font-medium transition-colors duration-200 2xl:px-2.5 2xl:text-[13px] ${
                    isActive
                      ? "text-violet-600"
                      : "text-gray-700 hover:text-violet-600"
                  }`}
                  aria-expanded={isOpen}
                >
                  {menu.label}

                  <ChevronDown
                    size={13}
                    strokeWidth={2}
                    className={`shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 text-violet-600"
                        : "group-hover:text-violet-600"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-0 top-full z-50 min-w-[210px] pt-2"
                    >
                      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-xl shadow-violet-100/60">
                        {menu.items.map((item) => (
                          <a
                            key={item}
                            href="#"
                            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-600"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="ml-3 hidden shrink-0 items-center gap-1.5 xl:flex">
          <a
            href={`tel:${emergencyPhone}`}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-violet-600 px-3 py-2.5 text-xs font-semibold text-violet-600 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white 2xl:px-4 2xl:text-sm"
          >
            <Phone size={15} />
            Emergency
          </a>

          <a
            href="/login"
            className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:text-violet-600 2xl:px-3 2xl:text-sm"
          >
            <UserRound size={15} />
            Log In
          </a>

          <a
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 2xl:px-5 2xl:text-sm"
          >
            Contact
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="ml-auto rounded-lg p-2 text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-600 xl:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 w-full max-w-[1600px] overflow-hidden rounded-2xl bg-white p-4 shadow-xl shadow-violet-100/50 xl:hidden"
          >
            <div className="flex flex-col">
              {menuItems.map((menu) => {
                const isOpen = mobileDropdown === menu.label;
                const isActive = menu.label === "Home";

                return (
                  <div key={menu.label}>
                    <button
                      type="button"
                      onClick={() => toggleMobileDropdown(menu.label)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors ${
                        isActive
                          ? "text-violet-600"
                          : "text-gray-700 hover:bg-violet-50 hover:text-violet-600"
                      }`}
                    >
                      <span>{menu.label}</span>

                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-violet-600" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 border-l border-violet-100 py-1 pl-3">
                            {menu.items.map((item) => (
                              <a
                                key={item}
                                href="#"
                                className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-violet-50 hover:text-violet-600"
                              >
                                {item}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-4">
                <a
                  href={`tel:${emergencyPhone}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-violet-600 px-4 py-3 text-sm font-semibold text-violet-600 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Phone size={16} />
                  Emergency
                </a>

                <a
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-600"
                >
                  <UserRound size={16} />
                  Log In
                </a>

                <a
                  href="/contact"
                  className="rounded-lg bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                >
                  Contact
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;