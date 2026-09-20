import type { Service } from "../../types/api";

export default function ServicePartners({ services }: { services: Service[] }) {
  const partners = services.filter((service) => service.isActive).slice(0, 5);
  if (!partners.length) return null;
  return (
    <section className="border-b border-slate-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-800">
          Partners
        </p>
        <div className="mt-7 grid grid-cols-2 items-center gap-8 opacity-55 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={`/services/${partner.slug}`}
              className="flex items-center justify-center text-center"
            >
              <div className="text-sm font-semibold leading-tight text-slate-500">
                {partner.title}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
