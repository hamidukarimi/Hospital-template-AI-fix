import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ClipboardList,
  Heart,
  MapPin,
  MessageCircleHeart,
  Phone,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { HelpSection as HelpSectionData } from "../types/api";

interface HelpSectionProps {
  helpSection?: HelpSectionData | null;
  isLoading?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  CalendarCheck,
  ClipboardList,
  Stethoscope,
  Phone,
  Building2,
  MessageCircleHeart,
};

const getCardStyle = (color?: string | null) => {
  const fallback = {
    background: "bg-[#dceeff]",
    border: "border-[#a9d6f7]",
    shadow: "shadow-[0_18px_25px_rgba(75,163,221,0.28)]",
    buttonHover: "hover:bg-[#edf7ff]",
    edge: "bg-[#a9d6f7]",
  };

  if (!color) {
    return fallback;
  }

  const normalized = color.toLowerCase();

  // Purple
  if (normalized === "#8b5cf6") {
    return {
      background: "bg-[#eee7fb]",
      border: "border-[#b798df]",
      shadow: "shadow-[0_18px_25px_rgba(142,91,194,0.3)]",
      buttonHover: "hover:bg-[#f8f5ff]",
      edge: "bg-[#b798df]",
    };
  }

  // Green
  if (normalized === "#22c55e") {
    return {
      background: "bg-[#dff8ee]",
      border: "border-[#8dd9bb]",
      shadow: "shadow-[0_18px_25px_rgba(76,194,151,0.28)]",
      buttonHover: "hover:bg-[#effcf7]",
      edge: "bg-[#8dd9bb]",
    };
  }

  // Red
  if (normalized === "#ef4444") {
    return {
      background: "bg-[#ffebe4]",
      border: "border-[#e4a18e]",
      shadow: "shadow-[0_18px_25px_rgba(224,119,94,0.3)]",
      buttonHover: "hover:bg-[#fff5f1]",
      edge: "bg-[#e4a18e]",
    };
  }

  return fallback;
};

const HelpSection = ({ helpSection, isLoading = false }: HelpSectionProps) => {
  const cards = helpSection?.cards ?? [];

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-[#f8f6ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="relative mx-auto max-w-[1260px] rounded-[48px] border border-white/90 bg-white/75 px-5 py-12 sm:px-8 sm:py-14 lg:px-14 lg:py-16">
          <div className="h-12 w-2/5 animate-pulse rounded bg-slate-200 mx-auto" />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-[30px] bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f8f6ef] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="pointer-events-none absolute -left-16 top-20 opacity-[0.08]">
        <Heart size={180} strokeWidth={1.5} className="text-[#8d7d70]" />
      </div>

      <div className="pointer-events-none absolute -right-16 top-8 opacity-[0.08]">
        <Building2 size={190} strokeWidth={1.5} className="text-[#8d7d70]" />
      </div>

      <div className="pointer-events-none absolute bottom-[-40px] left-[5%] opacity-[0.07]">
        <MapPin size={180} strokeWidth={1.5} className="text-[#8d7d70]" />
      </div>

      <div className="relative mx-auto max-w-[1260px] rounded-[48px] border border-white/90 bg-white/75 px-5 py-12 shadow-[0_18px_45px_rgba(50,45,40,0.10)] backdrop-blur-sm sm:px-8 sm:py-14 lg:px-14 lg:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center text-[36px] font-bold leading-tight tracking-[-1.2px] text-[#071535] sm:text-[42px] lg:text-[48px]"
        >
          {helpSection?.title || "How can we help you today?"}
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {cards.length === 0 ? (
            <div className="col-span-full rounded-[30px] border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">
              Help information is currently unavailable.
            </div>
          ) : (
            cards.map((card, index) => {
              const Icon = iconMap[card.icon] || ClipboardList;
              const styles = getCardStyle(card.color);

              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={`relative flex min-h-[420px] flex-col overflow-hidden rounded-[30px] border-2 ${styles.border} ${styles.background} ${styles.shadow}`}
                >
                  <div className="flex h-[130px] items-center justify-center pt-4">
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#102042]"
                    >
                      <Icon size={82} strokeWidth={1.5} />
                    </motion.div>
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-5 text-center">
                    <h3 className="text-[25px] font-bold leading-tight tracking-[-0.5px] text-[#071535]">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-[16px] leading-6 text-[#111827]">
                      {card.description}
                    </p>

                    <div className="mt-auto pt-5">
                      <a
                        href={card.buttonUrl || "#"}
                        className={`group flex h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 ${styles.border} bg-white/55 text-[16px] font-medium text-[#071535] transition-all duration-200 ${styles.buttonHover}`}
                      >
                        <span>{card.buttonText}</span>
                        <ArrowRight
                          size={20}
                          strokeWidth={1.8}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </a>
                    </div>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 h-[9px] w-full ${styles.edge}`}
                  />
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
