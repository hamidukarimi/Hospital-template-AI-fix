import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../lib/api";
import type { Testimonial as TestimonialData } from "../types/api";

interface TestimonialsSectionProps {
  testimonials?: TestimonialData[];
  isLoading?: boolean;
}

const TestimonialsSection = ({
  testimonials = [],
  isLoading = false,
}: TestimonialsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonials.length]);

  const data = testimonials.length > 0 ? testimonials : [];
  const currentTestimonial = data[currentIndex] ?? null;

  const showPrevious = () => {
    if (!data.length) return;
    setCurrentIndex((current) =>
      current === 0 ? data.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    if (!data.length) return;
    setCurrentIndex((current) =>
      current === data.length - 1 ? 0 : current + 1,
    );
  };

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-[#f9f9f8] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="relative mx-auto max-w-[1050px]">
          <div className="h-20 animate-pulse rounded bg-slate-200" />
          <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-[520px] animate-pulse rounded-[18px] bg-slate-200" />
            <div className="h-[520px] animate-pulse rounded-[18px] bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f9f9f8] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="pointer-events-none absolute right-[10%] top-[160px] hidden h-[130px] w-[130px] rotate-[-20deg] lg:block">
        <img src="./md-icon.png" alt="Decorative shape" />
      </div>

      <div className="relative mx-auto max-w-[1050px]">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[700px]"
        >
          <span className="inline-flex rounded-full bg-[#e8f0ff] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.05em] text-[#245da8]">
            Your health is our top priority
          </span>

          <h2 className="mt-3 text-[34px] font-normal leading-[1.12] tracking-[-1.2px] text-[#071535] sm:text-[40px] lg:text-[44px]">
            Our track record speaks for itself. Many individuals have chosen{" "}
            <span className="text-[#858894]">
              our medical center and have had positive, transformative
              experiences.
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-[18px]"
            >
              <img
                src="./test-img.png"
                alt="Healthcare center"
                className="h-[250px] w-full object-cover sm:h-[280px]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="min-h-[215px] rounded-[18px] bg-[#dcd4f7] p-6 shadow-[0_15px_30px_rgba(100,80,150,0.12)] sm:p-7"
            >
              <div className="text-[48px] font-bold leading-[0.7] text-white">
                “
              </div>

              {currentTestimonial ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="mt-3 max-w-[510px] text-[13px] leading-6 text-[#071535]">
                      {`"${currentTestimonial.content}"`}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            getImageUrl(currentTestimonial.image) ||
                            "https://placehold.co/80x80/bae6fd/334155?text=PT"
                          }
                          alt={currentTestimonial.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />

                        <div>
                          <h3 className="text-[11px] font-bold text-[#071535]">
                            {currentTestimonial.name}
                          </h3>
                          <p className="mt-0.5 text-[8px] text-[#5f6070]">
                            {currentTestimonial.role || "Patient"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={showPrevious}
                          aria-label="Previous testimonial"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/70 text-[#8580a5] transition-all duration-200 hover:bg-white hover:text-[#7652b8]"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={showNext}
                          aria-label="Next testimonial"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/70 text-[#8580a5] transition-all duration-200 hover:bg-white hover:text-[#7652b8]"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="mt-3 text-[13px] leading-6 text-[#071535]">
                  Testimonials are temporarily unavailable.
                </div>
              )}
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="ml-0 flex w-fit min-w-[175px] items-center gap-2 rounded-[15px] bg-[#c9f1df] px-5 py-4 shadow-[0_10px_25px_rgba(70,160,120,0.12)] lg:ml-0"
            >
              <div>
                <p className="text-[7px] font-medium uppercase tracking-[0.05em] text-[#395c53]">
                  Average Google Ratings
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[22px] font-bold text-red-500">G</span>
                  <Star
                    size={18}
                    fill="currentColor"
                    className="text-[#e5b93f]"
                  />
                  <span className="text-[17px] font-bold text-[#071535]">
                    4.9
                  </span>
                  <Star
                    size={18}
                    fill="currentColor"
                    className="text-[#e5b93f]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-[18px]"
            >
              <img
                src="./test-img-2.png"
                alt="Medical team"
                className="h-[250px] w-full object-cover sm:h-[280px]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="flex min-h-[115px] items-center gap-4 rounded-[18px] bg-[#dce4ed] px-5 py-4"
            >
              <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_5px_20px_rgba(100,130,180,0.2)]">
                <ShieldCheck
                  size={30}
                  strokeWidth={1.5}
                  className="text-[#4781c6]"
                />
              </div>

              <div>
                <p className="text-[8px] font-medium uppercase tracking-[0.06em] text-[#536070]">
                  HIPAA Compliant
                </p>
                <h3 className="mt-1 max-w-[230px] text-[13px] font-semibold leading-5 text-[#071535]">
                  Hospa provides award-winning quality care
                </h3>

                <a
                  href="#"
                  className="mt-2 inline-flex items-center gap-1 text-[9px] font-medium text-[#315ba4] transition-colors hover:text-violet-600"
                >
                  Learn More
                  <ArrowRight size={10} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
