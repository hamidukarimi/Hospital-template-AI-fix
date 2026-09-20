import { motion } from "framer-motion";
import { Calendar, Heart } from "lucide-react";

export default function AboutCtaBanner() {
  return (
    <section className="py-12 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-blue-600/20 to-teal-500/10 pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="rounded-2xl bg-blue-500/20 p-3.5 text-blue-400">
              <Heart className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Health. Our Priority.</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Experience the future of healthcare with AuraTech.
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-teal-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-teal-300 hover:shadow-lg hover:shadow-teal-400/20 active:scale-95">
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}