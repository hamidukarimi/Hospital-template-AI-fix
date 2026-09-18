import { ArrowRight, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl } from "../lib/api";
import type { Service as ServiceData } from "../types/api";

interface ServicesSectionProps {
  services?: ServiceData[];
  isLoading?: boolean;
}

const ServicesSection = ({
  services = [],
  isLoading = false,
}: ServicesSectionProps) => {
  const visibleServices = services.length > 0 ? services : [];

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-[#f3f6fa] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="relative mx-auto max-w-[1450px]">
          <div className="mx-auto h-14 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[360px] animate-pulse rounded-[20px] bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f3f6fa] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-[260px] w-[260px] rounded-full bg-violet-300/50 blur-[80px]" />

      <div className="relative mx-auto max-w-[1450px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[650px] text-center"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-blue-600">
            Our Services
          </p>

          <h2 className="mt-2 text-[31px] font-normal leading-[1.15] tracking-[-0.8px] text-[#071535] sm:text-[37px] lg:text-[42px]">
            We Serve In Different <span className="font-bold">Areas For</span>
            <br className="hidden sm:block" />
            <span className="font-bold">Our Patients</span>
          </h2>
        </motion.div>

        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleServices.length === 0 ? (
            <div className="col-span-full rounded-[20px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
              Services are currently unavailable.
            </div>
          ) : (
            visibleServices.map((service, index) => {
              const featureList = [service.category, service.linkText].filter(
                Boolean,
              ) as string[];

              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-[20px]">
                    <img
                      src={getImageUrl(service.image) || "./example.jpg"}
                      alt={service.title}
                      className="h-[255px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    <div className="absolute bottom-0 right-0 flex h-[58px] w-[72px] items-end justify-end rounded-tl-[32px] bg-[#f3f6fa] pl-3 pt-3">
                      <motion.a
                        href={service.linkUrl || "#"}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-white text-[#071535] shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-violet-500 hover:text-white"
                        aria-label={`View ${service.title}`}
                      >
                        <ArrowRight size={18} strokeWidth={1.8} />
                      </motion.a>
                    </div>
                  </div>

                  <div className="px-1 pt-4">
                    <h3 className="text-[13px] font-bold leading-5 text-[#071535]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-[9px] leading-[1.65] text-slate-500">
                      {service.description}
                    </p>

                    <div className="mt-3 space-y-2">
                      {featureList.slice(0, 2).map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCheck
                            size={14}
                            strokeWidth={2.4}
                            className="shrink-0 text-[#18b77b]"
                          />
                          <span className="text-[9px] font-medium text-[#071535]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-full bg-[#55b997] px-7 py-2.5 text-[10px] font-medium text-white shadow-[0_6px_15px_rgba(85,185,151,0.2)] transition-colors duration-200 hover:bg-violet-500"
          >
            <span>View All Services</span>
            <ArrowRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
