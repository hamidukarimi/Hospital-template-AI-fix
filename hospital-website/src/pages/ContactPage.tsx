import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactHero from "../components/contact/ContactHero";
import ContactInfoCards from "../components/contact/ContactInfoCards";
import ContactFormSection from "../components/contact/ContactFormSection";
import ContactMapSection from "../components/contact/ContactMapSection";
import { getFooter, getSiteSettings } from "../lib/api";
import type { FooterSettings, SiteSettings } from "../types/api";

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([getSiteSettings(), getFooter()])
      .then(([settingsData, footerData]) => {
        if (!active) return;
        setSettings(settingsData);
        setFooter(footerData);
      })
      .catch((err) => {
        console.error("Failed to load contact page settings:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const operatingHours = [
    { department: "Emergency & Trauma Care", hours: "24/7 Open" },
    {
      department: "Outpatient / OPD Clinics",
      hours: settings?.mondayFridayVisitingHours || "Mon - Fri: 8:00 AM - 8:00 PM",
    },
    {
      department: "Sunday Visiting Hours",
      hours: settings?.sundayVisitingHours || "Sun: 10:00 AM - 4:00 PM",
    },
    { department: "Pharmacy Services", hours: "24/7 Open" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar siteSettings={settings} isLoading={loading} />
      <main>
        <ContactHero />
        <ContactInfoCards
        loading={loading}
          emergencyPhone={settings?.emergencyPhone || "+1 (800) 999-4321"}
          generalPhone={settings?.phone || "+1 (800) 123-4567"}
          email={settings?.email || "contact@auratech-hospital.com"}
          address={settings?.address || "123 Healthcare Boulevard, Medical District"}
        />
        <ContactFormSection operatingHours={operatingHours} />
        {settings?.mapEmbedUrl && (
          <ContactMapSection mapEmbedUrl={settings.mapEmbedUrl} />
        )}
      </main>
      <Footer footer={footer} siteSettings={settings} isLoading={loading} />
    </div>
  );
}