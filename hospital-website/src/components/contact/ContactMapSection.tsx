interface ContactMapSectionProps {
  mapEmbedUrl: string;
}

export default function ContactMapSection({ mapEmbedUrl }: ContactMapSectionProps) {
  return (
    <section className="pb-16 mx-auto max-w-7xl px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-xl shadow-blue-500/5 border border-slate-100 aspect-[21/9] relative">
        <iframe
          title="Hospital Location Map"
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="w-full h-full grayscale opacity-90 hover:grayscale-0 transition duration-300"
        />
      </div>
    </section>
  );
}