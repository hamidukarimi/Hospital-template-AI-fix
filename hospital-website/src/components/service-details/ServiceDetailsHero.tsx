import { motion } from "framer-motion";
import { ArrowRight, Headphones, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Service, SiteSettings, Testimonial } from "../../types/api";
import { getImageUrl } from "../../lib/api";

interface Props {
  service: Service;
  siteSettings?: SiteSettings | null;
  testimonials: Testimonial[];
}

export default function ServiceDetailsHero({
  service,
  siteSettings,
  testimonials,
}: Props) {
  const stats = (service.metrics ?? []).slice(0, 2);
  const patients = testimonials.filter((item) => item.isActive).slice(0, 4);

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[650px] bg-slate-100">
        {service.image ? (
          <img
            src={getImageUrl(service.image)}
            alt={service.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-white/75" />
        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_0.75fr]">
            {/* Left Main Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#147BD5]">
                {service.category || service.title}
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
                {service.description}
              </p>
              {service.ctaText && service.ctaUrl ? (
                <a
                  href={service.ctaUrl}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#147BD5] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#106dbd]"
                >
                  {service.ctaText}
                  <ArrowRight size={17} />
                </a>
              ) : null}
              {patients.length ? (
                <div className="mt-9 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 text-xs shadow-sm"
                      >
                        {patient.image ? (
                          <img
                            src={getImageUrl(patient.image)}
                            alt={patient.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          patient.name.slice(0, 1)
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                      <Star
                        size={15}
                        fill="#F7C12B"
                        className="text-[#F7C12B]"
                      />
                      {patients[0].rating} Rating
                    </div>
                    <p className="text-sm text-slate-600">
                      {patients.length} trusted patient reviews
                    </p>
                  </div>
                </div>
              ) : null}
            </motion.div>

            {/* Right Side Cards Stack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="flex w-full max-w-xs flex-col gap-4">
                {/* 1. Dynamic Metric Cards (from ServiceMetric) */}
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-2xl border border-white/80 bg-white/85 px-7 py-4 text-center shadow-lg backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-[#147BD5]">
                      <CountUp value={stat.value} />
                      {stat.suffix}
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-700">
                      {stat.label}
                    </p>
                  </div>
                ))}

                {/* 2. Visiting Hours Card (from SiteSettings) */}
                {/* {siteSettings?.mondayFridayVisitingHours || siteSettings?.sundayVisitingHours ? (
                  <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#147BD5]">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                          Visiting Hours
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Mon - Fri: {siteSettings.mondayFridayVisitingHours || "8:00 AM - 8:00 PM"}
                        </p>
                        {siteSettings.sundayVisitingHours ? (
                          <p className="text-xs text-slate-600">
                            Sun: {siteSettings.sundayVisitingHours}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null} */}

                {/* 3. Original Patient Support Card */}
                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex h-20 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-slate-200">
                    <Headphones className="text-[#147BD5]" size={32} />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-semibold text-slate-900">
                      {siteSettings?.hospitalName || service.title} Patient Support
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {siteSettings?.phone ||
                        service.ctaText ||
                        "Patient support available when you need it."}
                    </p>
                  </div>
                </div>

                {/* 4. Direct Emergency / Contact Card (from SiteSettings) */}
                {/* {siteSettings?.phone ? (
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s+/g, "")}`}
                    className="group rounded-2xl border border-blue-100 bg-gradient-to-r from-[#147BD5] to-[#106dbd] p-4 text-white shadow-lg transition hover:shadow-xl hover:brightness-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                        <PhoneCall size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-100">
                          Need Immediate Assistance?
                        </p>
                        <p className="text-sm font-bold tracking-wide">
                          {siteSettings.phone}
                        </p>
                      </div>
                    </div>
                  </a>
                ) : null} */}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 700, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{display}</>;
}