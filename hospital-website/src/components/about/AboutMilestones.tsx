import { motion } from "framer-motion";

export default function AboutMilestones() {
  const milestones = [
    {
      year: "2000",
      title: "The Beginning",
      desc: "AuraTech Healthcare was founded with a simple belief — better healthcare for a brighter future.",
    },
    {
      year: "2008",
      title: "Our First Hospital",
      desc: "Opened our first modern hospital, bringing advanced care to our local community.",
    },
    {
      year: "2015",
      title: "Expanding Our Services",
      desc: "Added specialized departments including Cardiology, Neurology, Oncology and more.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      desc: "Introduced modern health tech solutions, including telemedicine and AI-powered diagnostics.",
    },
    {
      year: "2025",
      title: "A Healthier Tomorrow",
      desc: "Today, we continue to grow — with more specialists, more locations, and a bigger mission.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Heading & Building Image */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                OUR JOURNEY
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Key Milestones
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                From a small clinic to a leading healthcare provider, our journey has always been guided by one purpose — creating a healthier future for everyone.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1000"
                alt="AuraTech Hospital Main Campus Building"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 text-xs font-semibold text-white tracking-wide">
                Modern Facilities. Compassionate Care.
              </p>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="lg:col-span-7 relative pl-4 sm:pl-8">
            {/* Central Timeline Line */}
            <div className="absolute top-3 bottom-3 left-8 sm:left-12 w-0.5 bg-gradient-to-b from-blue-400 via-teal-400 to-emerald-400" />

            <div className="space-y-8">
              {milestones.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex items-start gap-6 group"
                >
                  {/* Glowing Marker Dot */}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border-2 border-teal-500 shadow-md group-hover:scale-110 transition-transform">
                    <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                  </div>

                  {/* Year Tag & Content */}
                  <div className="flex-1 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:border-teal-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-extrabold text-teal-700">
                        {item.year}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}