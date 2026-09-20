import { motion } from "framer-motion";
import { Mail, MapPin, PhoneCall } from "lucide-react";

interface ContactInfoCardsProps {
  emergencyPhone?: string;
  generalPhone?: string;
  email?: string;
  address?: string;
  loading?: boolean;
}

export default function ContactInfoCards({
  emergencyPhone,
  generalPhone,
  email,
  address,
  loading = false,
}: ContactInfoCardsProps) {
  if (loading) {
    return <ContactInfoCardsSkeleton />;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 -mt-12 relative z-20">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Emergency */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-rose-100 flex items-start gap-4"
        >
          <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
            <PhoneCall className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Emergency Line
            </p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {emergencyPhone}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Immediate 24/7 ambulance & trauma response
            </p>
          </div>
        </motion.div>

        {/* General */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4"
        >
          <div className="rounded-xl bg-blue-50 p-3 text-[#147BD5]">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#147BD5] uppercase tracking-wider">
              General Inquiries
            </p>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {email}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {generalPhone}
            </p>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4"
        >
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Hospital Location
            </p>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
              {address}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Main Campus, Building A
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactInfoCardsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 -mt-12 relative z-20">
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 animate-pulse"
          >
            {/* Icon Skeleton */}
            <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0" />

            {/* Content Skeleton */}
            <div className="space-y-2.5 w-full">
              {/* Category Tag */}
              <div className="h-3 w-24 rounded bg-slate-200" />
              {/* Main Heading/Value */}
              <div className="h-5 w-4/5 rounded bg-slate-200" />
              {/* Subtext */}
              <div className="h-3 w-3/5 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}