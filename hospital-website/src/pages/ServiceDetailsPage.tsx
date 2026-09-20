import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceDetailsHero from "../components/service-details/ServiceDetailsHero";
import ServicePartners from "../components/service-details/ServicePartners";
import ServiceOverview from "../components/service-details/ServiceOverview";
import ServiceDetailsServices from "../components/service-details/ServiceDetailsServices";
import {
  getFooter,
  getServiceBySlug,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "../lib/api";
import type {
  FooterSettings,
  Service,
  SiteSettings,
  Testimonial,
} from "../types/api";

export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    Promise.all([
      slug === "details" ? Promise.resolve(null) : getServiceBySlug(slug),
      getServices(),
      getSiteSettings(),
      getFooter(),
      getTestimonials(),
    ])
      .then(
        ([details, allServices, settings, footerData, testimonialsData]) => {
          if (!active) return;
          setService(
            details ?? (slug === "details" ? (allServices?.[0] ?? null) : null),
          );
          setServices(allServices ?? []);
          setSiteSettings(settings);
          setFooter(footerData);
          setTestimonials(testimonialsData ?? []);
          setError(!details && (slug !== "details" || !allServices?.length));
        },
      )
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar siteSettings={siteSettings} isLoading={loading} />
      <main>
        {loading ? <ServiceDetailsHeroSkeleton /> : null}

        {!loading && error ? (
          <div className="mx-auto max-w-7xl px-6 py-32 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Service not found
            </h1>
            <p className="mt-3 text-slate-600">
              The requested service is unavailable.
            </p>
          </div>
        ) : null}

        {!loading && service ? (
          <>
            <ServiceDetailsHero
              service={service}
              siteSettings={siteSettings}
              testimonials={testimonials}
            />
            <ServicePartners services={services} />
            <ServiceOverview service={service} />
            <ServiceDetailsServices
              services={services}
              currentSlug={service.slug}
            />
          </>
        ) : null}
      </main>
      <Footer footer={footer} siteSettings={siteSettings} isLoading={loading} />
    </div>
  );
}

function ServiceDetailsHeroSkeleton() {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-20 lg:py-28 text-white animate-pulse">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Text & CTA Skeletons */}
          <div className="space-y-6">
            {/* Category Tag */}
            <div className="h-4 w-32 rounded-full bg-slate-800" />

            {/* Title Block */}
            <div className="space-y-3">
              <div className="h-10 w-4/5 rounded-lg bg-slate-800" />
              <div className="h-10 w-3/5 rounded-lg bg-slate-800" />
            </div>

            {/* Description Lines */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-slate-800" />
              <div className="h-4 w-11/12 rounded bg-slate-800" />
              <div className="h-4 w-4/5 rounded bg-slate-800" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="h-12 w-44 rounded-full bg-slate-800" />
              <div className="h-12 w-36 rounded-full bg-slate-800" />
            </div>
          </div>

          {/* Right Column: Hero Image Container Skeleton */}
          <div className="relative flex justify-center">
            <div className="aspect-[4/3] w-full max-w-md rounded-3xl bg-slate-800 shadow-2xl lg:max-w-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}