import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Service } from "../../types/api";
import { getImageUrl } from "../../lib/api";

export default function ServiceDetailsServices({
  services,
  currentSlug,
}: {
  services: Service[];
  currentSlug: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const related = services.filter(
    (service) => service.slug !== currentSlug && service.isActive,
  );
  const visible = showAll ? related : related.slice(0, 4);
  if (!related.length) return null;
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold text-slate-600">
            {services.length} database services
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Our Services
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((service) => (
            <a
              key={service.id}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-52 overflow-hidden">
                {service.image ? (
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold leading-tight text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#147BD5]">
                  {service.linkText || "Learn More"}
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
        {related.length > 4 ? (
          <button
            onClick={() => setShowAll((value) => !value)}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800"
          >
            {showAll ? "Show Less" : "View All Services"}
            <ArrowRight size={16} className={showAll ? "rotate-180" : ""} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
