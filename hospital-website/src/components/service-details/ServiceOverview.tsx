import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Service } from "../../types/api";
import { getImageUrl } from "../../lib/api";

export default function ServiceOverview({ service }: { service: Service }) {
  console.log("Service Overview Received:", service);
  console.log("Metrics Array:", service?.metrics);

  const metrics = service.metrics ?? [];
  const stat1 = metrics[0];
  const stat2 = metrics[1];
  const stat3 = metrics[2];

  return (
    <section className="bg-slate-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {service.category || "About Our Services"}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {service.overviewTitle ||
                "Compassionate Care, Advanced Technology"}
            </h2>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-slate-600 lg:pt-6">
              {service.overviewDescription || service.description}
            </p>
          </div>
        </div>

        {/* Main 2-Column Content Area */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center">
          {/* Left Column: Compact Service Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl bg-slate-200 shadow-sm aspect-[4/3] max-h-[380px] w-full"
          >
            {service.image ? (
              <img
                src={getImageUrl(service.image)}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                Service Overview
              </div>
            )}
          </motion.div>

          {/* Right Column: 2x2 Grid Blocks */}
          <div className="grid gap-6 sm:grid-cols-2 items-stretch">
            {/* Row 1 - Left: Text Block 1 */}
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-900">
                {service.overviewTitle || "Our Patient-First Approach"}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {service.overviewDescription || service.description}
              </p>
              {service.ctaText && service.ctaUrl ? (
                <a
                  href={service.ctaUrl}
                  className="mt-4 inline-flex self-start items-center gap-1.5 rounded-full bg-[#147BD5] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#106dbd]"
                >
                  {service.ctaText}
                  <ArrowRight size={14} />
                </a>
              ) : null}
            </div>

            {/* Row 1 - Right: Stacked Dual Stats Card */}
            <div className="flex flex-col justify-center gap-6 rounded-2xl bg-gradient-to-b from-blue-50/90 to-blue-100/40 p-6 text-center border border-blue-100/60 shadow-sm">
              {stat1 ? (
                <div>
                  <div className="text-2xl font-extrabold text-[#147BD5] sm:text-3xl">
                    <CountUp value={stat1.value} />
                    {stat1.suffix}
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {stat1.label}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-extrabold text-[#147BD5] sm:text-3xl">
                    76+
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    Departments
                  </p>
                </div>
              )}

              {stat2 ? (
                <div>
                  <div className="text-2xl font-extrabold text-[#147BD5] sm:text-3xl">
                    <CountUp value={stat2.value} />
                    {stat2.suffix}
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {stat2.label}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-extrabold text-[#147BD5] sm:text-3xl">
                    2000+
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    Surgeries Annually
                  </p>
                </div>
              )}
            </div>

            {/* Row 2 - Left: Text Block 2 */}
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-900">
                {service.title || "Innovating with Technology for Health"}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {service.description}
              </p>
              {service.linkText && service.linkUrl ? (
                <a
                  href={service.linkUrl}
                  className="mt-4 inline-flex self-start items-center gap-1.5 rounded-full bg-[#147BD5] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#106dbd]"
                >
                  {service.linkText}
                  <ArrowRight size={14} />
                </a>
              ) : null}
            </div>

            {/* Row 2 - Right: Single Stat Card + CTA */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-b from-blue-50/90 to-blue-100/40 p-6 text-center border border-blue-100/60 shadow-sm">
              <div className="my-auto">
                {stat3 ? (
                  <>
                    <div className="text-2xl font-extrabold text-[#147BD5] sm:text-3xl">
                      <CountUp value={stat3.value} />
                      {stat3.suffix}
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-600">
                      {stat3.label}
                    </p>
                  </>
                ) : (
                  <div className="text-2xl font-extrabold text-[#147BD5] sm:text-3xl">
                    1000+
                  </div>
                )}
              </div>

              {service.ctaText && service.ctaUrl ? (
                <a
                  href={service.ctaUrl}
                  className="w-full rounded-full bg-[#147BD5] px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#106dbd] shadow-sm"
                >
                  {service.ctaText}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1000, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, isInView]);

  return <span ref={ref}>{display}</span>;
}
