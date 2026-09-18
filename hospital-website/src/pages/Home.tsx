import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HelpSection from "../components/HelpSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import WhyChooseSection from "../components/WhyChooseSection";
import LabTestsSection from "../components/LabTestsSection";
import DoctorsSection from "../components/DoctorsSection";
import ArticlesSection from "../components/ArticlesSection";
import Footer from "../components/Footer";
import {
  getAboutSection,
  getArticles,
  getDoctors,
  getFooter,
  getHelpSection,
  getHero,
  getLabTests,
  getServices,
  getSiteSettings,
  getTestimonials,
  getWhyChooseUs,
} from "../lib/api";
import type {
  AboutSection as AboutSectionData,
  Article,
  Doctor,
  FooterSettings,
  HeroSection,
  HelpSection as HelpSectionData,
  LabTest,
  Service,
  SiteSettings,
  Testimonial,
  WhyChooseUsItem,
} from "../types/api";

function Home() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [helpSection, setHelpSection] = useState<HelpSectionData | null>(null);
  const [aboutSection, setAboutSection] = useState<AboutSectionData | null>(
    null,
  );
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const [
        settings,
        heroData,
        helpData,
        aboutData,
        servicesData,
        testimonialsData,
        whyChooseUsData,
        labTestsData,
        doctorsData,
        articlesData,
        footerData,
      ] = await Promise.all([
        getSiteSettings(),
        getHero(),
        getHelpSection(),
        getAboutSection(),
        getServices(),
        getTestimonials(),
        getWhyChooseUs(),
        getLabTests(),
        getDoctors(),
        getArticles(),
        getFooter(),
      ]);

      if (!isMounted) {
        return;
      }

      setSiteSettings(settings);
      setHero(heroData);
      setHelpSection(helpData);
      setAboutSection(aboutData);
      setServices(servicesData ?? []);
      setTestimonials(testimonialsData ?? []);
      setWhyChooseUs(whyChooseUsData ?? []);
      setLabTests(labTestsData ?? []);
      setDoctors(doctorsData ?? []);
      setArticles(articlesData ?? []);
      setFooter(footerData);
      setIsLoading(false);
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar siteSettings={siteSettings} isLoading={isLoading} />
      <Hero hero={hero} siteSettings={siteSettings} isLoading={isLoading} />
      <HelpSection helpSection={helpSection} isLoading={isLoading} />
      <AboutSection
        aboutSection={aboutSection}
        siteSettings={siteSettings}
        isLoading={isLoading}
      />
      <ServicesSection services={services} isLoading={isLoading} />
      <TestimonialsSection testimonials={testimonials} isLoading={isLoading} />
      <WhyChooseSection items={whyChooseUs} isLoading={isLoading} />
      <LabTestsSection labTests={labTests} isLoading={isLoading} />
      <DoctorsSection doctors={doctors} isLoading={isLoading} />
      <ArticlesSection articles={articles} isLoading={isLoading} />
      <Footer
        footer={footer}
        siteSettings={siteSettings}
        isLoading={isLoading}
      />
    </>
  );
}

export default Home;
