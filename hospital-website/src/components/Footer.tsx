import { motion } from "framer-motion";
import { Clock3, MapPin } from "lucide-react";
import { getImageUrl } from "../lib/api";
import type { FooterSettings, SiteSettings } from "../types/api";

interface FooterProps {
  footer?: FooterSettings | null;
  siteSettings?: SiteSettings | null;
  isLoading?: boolean;
}

const socialIconMap: Record<string, string> = {
  FACEBOOK: "f",
  INSTAGRAM: "◎",
  TWITTER: "𝕏",
  LINKEDIN: "in",
};

const Footer = ({ footer, siteSettings, isLoading = false }: FooterProps) => {
  const columns = footer?.columns ?? [];
  const socialLinks =
    siteSettings?.socialMedia?.filter((item) => item.isActive) ?? [];
  const logoSrc =
    getImageUrl(siteSettings?.logo || footer?.logo) || "./h-logo.svg";
  const hospitalName = siteSettings?.hospitalName || "Ali Hospital";
  const location =
    footer?.location ||
    siteSettings?.address ||
    "485 Bayshore Blvd. Ste 154, San Francisco, CA 95124";
  const visitingHours =
    footer?.visitingHours ||
    siteSettings?.mondayFridayVisitingHours ||
    "Sunday: 08:00 AM - 10:00 PM\nMonday - Friday: 06:00 AM - 12:00 AM";
  const phone = footer?.phone || siteSettings?.phone || "+011 3253 4567";

  if (isLoading) {
    return (
      <footer className="relative overflow-hidden bg-[#030d2d] text-white">
        <div className="relative z-10 mx-auto max-w-[1450px] px-6 pb-10 pt-12 sm:px-10 lg:px-14 lg:pb-12 lg:pt-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_3fr] lg:gap-12">
            <div className="h-[200px] animate-pulse rounded bg-slate-700" />
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[220px] animate-pulse rounded bg-slate-700"
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-[#030d2d] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[180px]">
        <svg
          viewBox="0 0 1000 180"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="footerBorderGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#087cff" />
              <stop offset="48%" stopColor="#19bfff" />
              <stop offset="100%" stopColor="#08e7d6" />
            </linearGradient>
            <linearGradient
              id="footerFadeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="35%" stopColor="white" stopOpacity="0.9" />
              <stop offset="70%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="footerFadeMask">
              <rect width="1000" height="180" fill="url(#footerFadeGradient)" />
            </mask>
            <filter id="footerGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g mask="url(#footerFadeMask)" filter="url(#footerGlow)">
            <path
              d="M 18 155 L 18 70 C 18 40 40 20 70 20 L 930 20 C 960 20 982 40 982 70 L 982 155"
              fill="none"
              stroke="url(#footerBorderGradient)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <div className="pointer-events-none absolute -left-40 top-24 h-72 w-72 rounded-full bg-[#0878ff]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-16 h-80 w-80 rounded-full bg-[#00e5ff]/10 blur-[110px]" />
      <div className="pointer-events-none absolute left-8 top-28 hidden opacity-25 sm:block">
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 36 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-[#3bbfff]" />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-8 top-16 hidden opacity-25 sm:block">
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 49 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-[#3bbfff]" />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-48 w-[600px] rotate-[9deg] rounded-[50%] border border-[#00d9ff]/15" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-52 w-[620px] rotate-[-10deg] rounded-[50%] border border-[#00e5ff]/15" />

      <div className="relative z-10 mx-auto max-w-[1450px] px-6 pb-10 pt-12 sm:px-10 lg:px-14 lg:pb-12 lg:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_3fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-7">
              <a
                href="/"
                aria-label={`${hospitalName} home`}
                className="inline-block"
              >
                <img src={logoSrc} alt={hospitalName} className="w-25" />
              </a>
            </div>

            <div className="mb-5 flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00efff] to-[#007cff] shadow-[0_0_18px_rgba(0,220,255,0.4)]">
                <MapPin size={19} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold">Locations</h3>
                <p className="mt-1 max-w-[270px] text-[14px] leading-6 text-white/90">
                  {location}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00efff] to-[#007cff] shadow-[0_0_18px_rgba(0,220,255,0.4)]">
                <Clock3 size={19} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold">Visiting Hours</h3>
                <p className="mt-1 text-[14px] leading-6 text-white/90 whitespace-pre-line">
                  {visitingHours}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <a
                href={`tel:${phone}`}
                className="text-[14px] text-white/90 hover:text-[#12dff5]"
              >
                {phone}
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
            {columns.length === 0 ? (
              <div className="col-span-full rounded border border-dashed border-slate-600 p-6 text-slate-300">
                Footer navigation is unavailable.
              </div>
            ) : (
              columns.map((column, index) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                >
                  <h3 className="text-[19px] font-bold text-[#12dff5]">
                    {column.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {column.links.length === 0 ? (
                      <li className="text-[14px] text-white/60">
                        No links available
                      </li>
                    ) : (
                      column.links.map((link) => (
                        <li key={link.id}>
                          <a
                            href={link.url || "#"}
                            className="text-[14px] text-white/90 transition-colors duration-200 hover:text-[#12dff5]"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))
                    )}
                  </ul>

                  {index === columns.length - 1 && socialLinks.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-[19px] font-bold text-[#12dff5]">
                        Social Media
                      </h3>
                      <div className="mt-4 flex gap-2.5">
                        {socialLinks.map((item) => (
                          <SocialButton
                            key={item.id}
                            icon={socialIconMap[item.platform] || "•"}
                            label={item.platform}
                            href={item.url}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 border border-[#8cdfff]/60 bg-gradient-to-r from-[#d9f5ff]/90 via-[#edf8ff]/95 to-[#d9f5ff]/90 px-4 py-3 text-center shadow-[0_-4px_20px_rgba(80,200,255,0.18)]"
      >
        <p className="text-[14px] text-[#061334] sm:text-[16px]">
          © {hospitalName} All Rights Reserved by{" "}
          <span className="font-bold">HiBootstrap</span>
        </p>
      </motion.div>
    </footer>
  );
};

interface SocialButtonProps {
  icon: string;
  label: string;
  href: string;
}

const SocialButton = ({ icon, label, href }: SocialButtonProps) => {
  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#5e8cff] via-[#29bff4] to-[#04e7e2] text-white shadow-[0_4px_15px_rgba(0,200,255,0.4)] transition-shadow duration-300 hover:shadow-[0_6px_22px_rgba(0,220,255,0.65)]"
    >
      <span className="text-[14px] font-semibold">{icon}</span>
    </motion.a>
  );
};

export default Footer;
