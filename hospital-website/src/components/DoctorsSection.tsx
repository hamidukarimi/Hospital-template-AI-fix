import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "../lib/api";
import type { Doctor as DoctorData } from "../types/api";

interface DoctorsSectionProps {
  doctors?: DoctorData[];
  isLoading?: boolean;
}

const DoctorsSection = ({
  doctors = [],
  isLoading = false,
}: DoctorsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [page, setPage] = useState(0);

  const categories = useMemo(() => {
    const values = new Set(
      doctors.map((doctor) => doctor.category || "General"),
    );
    return ["All", ...Array.from(values)];
  }, [doctors]);

  useEffect(() => {
    setPage(0);
    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  const filteredDoctors = useMemo(() => {
    if (activeCategory === "All") return doctors;
    return doctors.filter(
      (doctor) => (doctor.category || "General") === activeCategory,
    );
  }, [activeCategory, doctors]);

  const doctorsPerPage = 4;
  const pageCount = Math.max(
    1,
    Math.ceil(filteredDoctors.length / doctorsPerPage),
  );
  const visibleDoctors = filteredDoctors.slice(
    page * doctorsPerPage,
    page * doctorsPerPage + doctorsPerPage,
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(0);
  };

  const nextPage = () =>
    setPage((current) => (current >= pageCount - 1 ? 0 : current + 1));
  const previousPage = () =>
    setPage((current) => (current <= 0 ? pageCount - 1 : current - 1));

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-[#e9f8ff] via-[#f2f8ff] to-[#f2efff] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="mx-auto h-16 w-72 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 flex justify-center gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-24 animate-pulse rounded-full bg-slate-200"
              />
            ))}
          </div>
          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e9f8ff] via-[#f2f8ff] to-[#f2efff] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full border-[28px] border-[#d6ecfa] opacity-80" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/70" />
      <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[25px] border-[#d9eef7] opacity-70" />
      <div className="pointer-events-none absolute right-20 top-16 h-28 w-28 rounded-full bg-[#eef1ff]/80 blur-xl" />
      <div className="pointer-events-none absolute left-0 top-[45%] h-52 w-28 -translate-y-1/2 rounded-r-[100px] bg-gradient-to-b from-[#c9eafa] to-[#dcd7fa] opacity-60" />
      <div className="pointer-events-none absolute -right-20 top-[45%] h-72 w-72 rounded-full bg-[#cfc6fa]/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[13px] font-bold uppercase tracking-[0.8px] text-[#2189ca]">
              Doctors
            </span>
          </div>

          <h2 className="mt-3 text-[38px] font-normal leading-[1.08] tracking-[-1.5px] text-[#071535] sm:text-[48px] lg:text-[52px]">
            Our <span className="font-bold">Expert Doctors</span>
            <br />
            <span className="font-bold text-[#147bd5]">For The Patients</span>
            <span className="relative ml-2 inline-block align-middle">
              <svg
                width="50"
                height="30"
                viewBox="0 0 50 30"
                fill="none"
                className="inline-block"
              >
                <path
                  d="M3 25C12 22 17 18 21 11C25 5 32 5 39 9"
                  stroke="#4887c9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M28 3C34 2 41 4 47 7"
                  stroke="#4887c9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <motion.button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2 }}
                className={`rounded-full border px-5 py-2.5 cursor-pointer text-[15px] font-normal transition-all duration-300 ${
                  active
                    ? "border-transparent bg-gradient-to-r from-[#0799ec] to-[#1680dd] text-white shadow-[0_8px_22px_rgba(20,135,225,0.38)]"
                    : "border-[#9eb9d3] bg-white/10 text-[#17243c] backdrop-blur-sm hover:border-[#4498d4] hover:text-[#147bd5]"
                }`}
              >
                {category}
              </motion.button>
            );
          })}
        </motion.div>

        <div className="relative mt-9">
          {filteredDoctors.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-500">
              Doctors are currently unavailable.
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${page}`}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {visibleDoctors.map((doctor, index) => (
                  <motion.article
                    key={doctor.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    whileHover={{ y: -7 }}
                    className="group relative overflow-hidden rounded-[20px] border border-white/80 bg-white/60 p-[9px] shadow-[0_15px_35px_rgba(60,110,150,0.16)] backdrop-blur-sm"
                  >
                    <div className="relative">
                      <div
                        className="absolute inset-x-3 bottom-0 h-[75%] rounded-[25px] blur-[22px] opacity-60 transition-all duration-300 group-hover:opacity-90"
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#5bc8f5" : "#7c83f5",
                        }}
                      />

                      <div className="relative h-[315px] overflow-hidden rounded-[15px] bg-white">
                        <img
                          src={getImageUrl(doctor.image) || "./doc-1.jpg"}
                          alt={doctor.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />

                        <div className="absolute bottom-0 right-0 h-[72px] w-[76px] bg-white">
                          <div className="absolute -left-[22px] bottom-0 h-[22px] w-[22px] rounded-br-[22px] bg-transparent shadow-[8px_8px_0_8px_white]" />
                          <div className="absolute -top-[22px] right-0 h-[22px] w-[22px] rounded-br-[22px] bg-transparent shadow-[8px_8px_0_8px_white]" />

                          <motion.a
                            href={doctor.profileUrl || "#"}
                            aria-label={`View ${doctor.name}`}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            className="absolute bottom-[8px] right-[8px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gradient-to-br from-[#10a6ee] to-[#1676dd] text-white shadow-[0_7px_16px_rgba(20,120,220,0.35)] transition-all duration-300 group-hover:shadow-[0_9px_20px_rgba(20,120,220,0.5)]"
                          >
                            <ArrowRight size={21} strokeWidth={2} />
                          </motion.a>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 pb-3 pt-4">
                      <h3 className="truncate text-[20px] font-bold tracking-[-0.5px] text-[#071535]">
                        {doctor.name}
                      </h3>
                      <p className="mt-1 text-[15px] text-[#506174]">
                        {doctor.specialty}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={previousPage}
              aria-label="Previous doctors"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9eb9d3] bg-white/60 text-[#147bd5] transition-all hover:bg-white"
            >
              <ArrowRight size={17} className="rotate-180" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index)}
                  aria-label={`Go to doctor page ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${page === index ? "w-7 bg-[#147bd5]" : "w-2 bg-[#a9c4d8]"}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextPage}
              aria-label="Next doctors"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9eb9d3] bg-white/60 text-[#147bd5] transition-all hover:bg-white"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;
