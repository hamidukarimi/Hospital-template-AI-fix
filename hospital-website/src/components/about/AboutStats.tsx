import { motion } from "framer-motion";
import { Calendar, HeartHandshake, Users } from "lucide-react";

export default function AboutStats() {
  const stats = [
    {
      icon: Calendar,
      value: "25+",
      title: "Years Experience",
      desc: "A legacy of trust, care and innovation",
    },
    {
      icon: Users,
      value: "150+",
      title: "Specialists",
      desc: "World-class doctors across multiple fields",
    },
    {
      icon: HeartHandshake,
      value: "50k+",
      title: "Patients Treated",
      desc: "Real people. Real stories. Healthier tomorrows.",
    },
  ];

  return (
    <section className="py-12 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 shadow-2xl text-white relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Heading Block */}
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                OUR IMPACT
              </p>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Trusted by Thousands, Driven by Excellence
              </h2>
              <p className="text-sm text-slate-400">
                For over two decades, we've been committed to providing high-quality healthcare and making a difference in people's lives.
              </p>
            </div>

            {/* Metrics List */}
            <div className="lg:col-span-8 grid gap-8 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="pt-6 sm:pt-0 sm:pl-8 first:pl-0 space-y-2"
                  >
                    <div className="rounded-xl bg-slate-800/80 p-2.5 w-fit text-teal-400 border border-slate-700/50">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-sm font-semibold text-slate-200">{stat.title}</div>
                    <p className="text-xs text-slate-400">{stat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}