import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Dna,
  FlaskConical,
  Microscope,
  ScanLine,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { LabTest as LabTestData } from "../types/api";

interface LabTestsSectionProps {
  labTests?: LabTestData[];
  isLoading?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  ScanLine,
  Activity,
  FlaskConical,
  Dna,
  Stethoscope,
  Microscope,
};

const formatPrice = (value: number | string | null | undefined) => {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(parsed);
};

const formatDiscount = (value: number | string | null | undefined) => {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed <= 0) return "Special Offer";
  return `${parsed}% OFF`;
};

const LabTestsSection = ({
  labTests = [],
  isLoading = false,
}: LabTestsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = labTests.length > 0 ? labTests : [];
  const visibleCards = 2;
  const maxIndex = Math.max(0, data.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));
  };

  const previousSlide = () => {
    setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1));
  };

  const progress = maxIndex === 0 ? 100 : (currentIndex / maxIndex) * 100;

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-[#edf6fb] px-5 py-16 sm:px-8 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
            <div className="h-[520px] animate-pulse rounded-[18px] bg-slate-200" />
            <div className="h-[520px] animate-pulse rounded-[18px] bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#edf6fb] px-5 py-16 sm:px-8 lg:px-6 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative min-h-[520px] overflow-hidden rounded-[18px] bg-[#12374d]"
          >
            <img
              src="./lab-sec-bg.png"
              alt="Laboratory"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#0c4260]/90 via-[#14506c]/50 to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute bottom-7 left-0 flex w-[calc(100%-10px)] max-w-[505px] items-center gap-4 rounded-r-full border border-white/60 bg-white/75 px-6 py-4 backdrop-blur-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#18b8c8] to-[#2480d5]" />
                  <div className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2">
                    <span className="absolute left-0 h-4 w-1 rotate-[25deg] bg-[#159eb8]" />
                    <span className="absolute right-0 h-4 w-1 -rotate-[25deg] bg-[#159eb8]" />
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-[14px] font-bold uppercase tracking-[-0.2px] text-[#071535]">
                  Precision Proficiency Award
                </h3>
                <p className="mt-1 max-w-[360px] text-[11px] leading-[1.45] text-[#26394a]">
                  Awarded to our Lab Test Center for consistently achieving
                  unparalleled precision in test results.
                </p>
              </div>

              <div className="ml-auto hidden h-10 w-10 shrink-0 rounded-full border border-white/70 bg-[#9bcaf4] sm:block" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[18px] border border-white/80 bg-[#e7f3fa] px-6 py-8 shadow-[0_10px_40px_rgba(100,150,180,0.08)] sm:px-10 lg:px-12"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-[220px] w-[280px] opacity-30">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(#9ec0d4 1px, transparent 1px), linear-gradient(90deg, #9ec0d4 1px, transparent 1px)",
                  backgroundSize: "25px 25px",
                  maskImage:
                    "linear-gradient(to bottom left, black, transparent)",
                }}
              />
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 h-[170px] w-[170px] opacity-25">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(#719bb4 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex rounded-full bg-gradient-to-r from-[#0878ef] to-[#154de1] px-4 py-2 shadow-[0_6px_18px_rgba(30,100,230,0.35)]"
              >
                <span className="text-[12px] font-bold tracking-wide text-white">
                  LAB TEST
                </span>
              </motion.div>

              <h2 className="mt-5 max-w-[600px] text-[36px] font-normal leading-[1.1] tracking-[-1.2px] text-[#071535] sm:text-[42px]">
                We Have Lab Test Facilities
                <br />
                <span className="font-bold">Book Yours Today</span>
              </h2>

              <div className="relative mt-2 h-[6px] w-[255px]">
                <svg
                  viewBox="0 0 255 8"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 5 C70 1, 170 7, 252 3"
                    fill="none"
                    stroke="#3159c5"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="mt-9 overflow-hidden">
                {data.length === 0 ? (
                  <div className="rounded-[17px] border border-dashed border-slate-300 bg-white/45 p-6 text-slate-500">
                    Lab tests are currently unavailable.
                  </div>
                ) : (
                  <motion.div
                    className="flex gap-5"
                    animate={{ x: `-${currentIndex * (50 + 2.2)}%` }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  >
                    {data.map((test) => {
                      const Icon = iconMap[test.title] || Stethoscope;
                      const iconBackground =
                        test.color ||
                        "linear-gradient(135deg, #6424d8 0%, #3d52ed 100%)";

                      return (
                        <div
                          key={test.id}
                          className="w-full shrink-0 sm:w-[calc(50%-10px)]"
                        >
                          <motion.div
                            whileHover={{ y: -5 }}
                            className="relative flex min-h-[280px] flex-col rounded-[17px] border border-white/90 bg-white/45 p-4 shadow-[0_12px_30px_rgba(70,130,170,0.15)] backdrop-blur-sm"
                          >
                            <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#155ee8] to-[#147de2] px-4 py-0.5 shadow-[0_5px_15px_rgba(30,100,220,0.22)]">
                              <span className="text-[13px] font-bold text-white">
                                {formatDiscount(test.discount)}
                              </span>
                            </div>

                            <div
                              className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] shadow-[0_8px_18px_rgba(55,70,180,0.25)]"
                              style={{ background: iconBackground }}
                            >
                              <Icon
                                size={29}
                                strokeWidth={1.7}
                                className="text-white"
                              />
                            </div>

                            <h3 className="mt-4 text-[21px] font-bold tracking-[-0.5px] text-[#071535]">
                              {test.title}
                            </h3>
                            <p className="mt-2 max-w-[240px] text-[13px] leading-5 text-[#172332]">
                              {test.description}
                            </p>

                            <p className="pt-6 text-[13px] font-bold uppercase text-[#071535]">
                              Starting From{" "}
                              <span className="text-[15px]">
                                {formatPrice(test.price)}
                              </span>
                            </p>

                            <motion.a
                              href={test.buttonUrl || "#"}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="mt-5 flex h-[37px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#a84bdf] via-[#7454e8] to-[#2775df] text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(100,75,220,0.28)] transition-all duration-200 hover:shadow-[0_10px_24px_rgba(100,75,220,0.4)]"
                            >
                              <span>
                                {test.buttonText || "Schedule A Test"}
                              </span>
                              <ArrowRight size={17} strokeWidth={2} />
                            </motion.a>
                          </motion.div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              <div className="mt-9 flex items-center gap-4">
                <div className="relative h-[4px] flex-1 overflow-visible rounded-full bg-[#9bb5c6]">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4355d8] to-[#6e7bea]"
                    animate={{ width: `${Math.max(8, progress)}%` }}
                    transition={{ duration: 0.35 }}
                  />
                  <motion.div
                    className="absolute top-1/2 h-[15px] w-[15px] -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_2px_8px_rgba(50,90,180,0.3)]"
                    animate={{
                      left: `${Math.min(98, Math.max(2, progress))}%`,
                    }}
                    transition={{ duration: 0.35 }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous lab test"
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#b6c8d5] cursor-pointer bg-white/70 text-[#071535] shadow-[0_3px_8px_rgba(50,80,100,0.08)] transition-all duration-200 hover:bg-white hover:text-[#4260d7]"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next lab test"
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#b6c8d5] cursor-pointer bg-white/70 text-[#071535] shadow-[0_3px_8px_rgba(50,80,100,0.08)] transition-all duration-200 hover:bg-white hover:text-[#4260d7]"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LabTestsSection;
