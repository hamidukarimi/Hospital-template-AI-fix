import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl } from "../lib/api";
import type {
  AboutSection as AboutSectionData,
  SiteSettings,
} from "../types/api";

interface AboutSectionProps {
  aboutSection?: AboutSectionData | null;
  siteSettings?: SiteSettings | null;
  isLoading?: boolean;
}

const AboutSection = ({
  aboutSection,
  siteSettings,
  isLoading = false,
}: AboutSectionProps) => {
  const titleText =
    aboutSection?.title || "Your trusted partner in Dental Wellness";
  const smallTitle = aboutSection?.smallTitle || "ABOUT HOSPA";
  const description =
    aboutSection?.description ||
    "We are committed to transforming oral health and creating beautiful, confident smiles. Located in the heart of Los Angeles, our clinic has been a trusted provider of high-quality dental care for over 20 years.";
  const imageSrc = getImageUrl(aboutSection?.image) || "./About.png";
  const profileImage = getImageUrl(aboutSection?.informationImage) || imageSrc;
  const buttonText = aboutSection?.buttonText || "More About Us";
  const buttonUrl = aboutSection?.buttonUrl || "#";
  const emergencyPhone = siteSettings?.phone || "+011 3253 4567";
  const infoTitle = aboutSection?.informationTitle || "Willie Fuentes";
  const infoSubtitle = aboutSection?.informationSubtitle || "Co Founder";
  const rating = aboutSection?.rating ?? 4.9;

  if (isLoading) {
    return (
      <section className="bg-white px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-[42%_58%] lg:gap-12">
          <div className="h-[360px] animate-pulse rounded-[20px] bg-slate-200" />
          <div className="space-y-4">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-[42%_58%] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center lg:justify-start"
        >
          <img
            src={imageSrc}
            alt={titleText}
            className="h-auto w-full max-w-[360px] object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-600">
            {smallTitle}
          </p>

          <h2 className="mt-2 max-w-[520px] text-[31px] font-normal leading-[1.15] tracking-[-0.8px] text-[#071535] sm:text-[35px]">
            {titleText.includes(" ") && titleText.split(" ").length > 3 ? (
              <>
                {titleText.split(" ").slice(0, -2).join(" ")}{" "}
                <span className="font-bold">
                  {titleText.split(" ").slice(-2).join(" ")}
                </span>
              </>
            ) : (
              titleText
            )}
          </h2>

          <div className="mt-4 max-w-[540px] space-y-1.5 text-[9px] leading-[1.6] text-slate-500 sm:text-[10px]">
            {description
              .split(/\n|\.|(?<=\.)\s/)
              .filter(Boolean)
              .slice(0, 2)
              .map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph.trim()}</p>
              ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <motion.a
              href={buttonUrl}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-2.5 text-[9px] font-medium text-white transition-colors hover:bg-violet-600"
            >
              {buttonText}
              <ArrowRight size={12} strokeWidth={2} />
            </motion.a>

            <div className="flex items-center gap-2">
              <img
                src={profileImage}
                alt={infoTitle}
                className="h-8 w-8 rounded-full object-cover"
              />

              <div>
                <p className="text-[9px] font-semibold leading-tight text-[#071535]">
                  {infoTitle}
                </p>
                <p className="mt-0.5 text-[7px] text-slate-400">
                  {infoSubtitle}
                </p>
              </div>
            </div>

            <div className="ml-1 hidden h-6 w-16 items-center justify-center text-[6px] font-medium text-slate-400 sm:flex">
              {siteSettings?.hospitalName?.slice(0, 6).toUpperCase() || "HOSPA"}{" "}
              LOGO
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-[#00b67a]">
                  ★
                </span>
                <span className="text-[9px] font-semibold text-[#071535]">
                  Trustpilot
                </span>
              </div>

              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="flex h-[15px] w-[15px] items-center justify-center bg-[#00b67a] text-[9px] text-white"
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="mt-1 text-[6px] text-slate-400">
                TrustScore {Number(rating).toFixed(1)} | 29 Reviews
              </p>
            </div>

            <div className="flex min-h-[52px] min-w-[160px] items-center justify-center rounded-full bg-[#eeedff] px-5 py-2.5">
              <div className="text-center">
                <p className="text-[7px] text-[#071535]">
                  Need an Emergency Help? Call Us!
                </p>
                <a
                  href={`tel:${emergencyPhone}`}
                  className="mt-1 flex items-center justify-center gap-1 text-[9px] font-semibold text-violet-600"
                >
                  <Phone size={9} />
                  {emergencyPhone}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
