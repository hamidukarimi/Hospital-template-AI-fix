import { motion } from "framer-motion";
import { ArrowRight, Eye, Target } from "lucide-react";

export default function AboutMissionVision() {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Our Mission Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/80 via-sky-50/40 to-white p-8 sm:p-10 border border-blue-100 shadow-xl shadow-blue-900/5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex rounded-2xl bg-blue-500/10 p-3.5 text-blue-600">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Better Care. A Healthier Tomorrow.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Our mission is to deliver exceptional, patient-centered healthcare by combining advanced medical technology, expertise, and genuine compassion — improving lives and building healthier communities.
              </p>
            </div>
            <div className="pt-6">
              <button className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Our Vision Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white p-8 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-900/5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex rounded-2xl bg-emerald-500/10 p-3.5 text-emerald-600">
                <Eye className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                A Healthier World, Powered by Innovation.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We envision a future where everyone has access to high-quality, personalized healthcare — where technology empowers people, and compassion remains at the heart of every decision.
              </p>
            </div>
            <div className="pt-6">
              <button className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}