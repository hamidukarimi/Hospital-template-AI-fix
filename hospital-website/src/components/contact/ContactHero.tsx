import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 py-20 lg:py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            We are available 24/7
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Get in Touch with Our Team
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Have a question about our services, need to schedule a consultation, or require emergency assistance? We're here to help you every step of the way.
          </p>
        </motion.div>
      </div>
    </section>
  );
}   