import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutHero from "../components/about/AboutHero";
import AboutMissionVision from "../components/about/AboutMissionVision";
import AboutStats from "../components/about/AboutStats";
import AboutMilestones from "../components/about/AboutMilestones";
import AboutCtaBanner from "../components/about/AboutCtaBanner";
import { getFooter, getSiteSettings } from "../lib/api";
import type { FooterSettings, SiteSettings } from "../types/api";

export default function AboutPage() {
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
        console.error("Failed to load about page settings:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar siteSettings={settings} isLoading={loading} />
      <main>
        <AboutHero />
        <AboutMissionVision />
        <AboutStats />
        <AboutMilestones />
        <AboutCtaBanner />
      </main>
      <Footer footer={footer} siteSettings={settings} isLoading={loading} />
    </div>
  );
}