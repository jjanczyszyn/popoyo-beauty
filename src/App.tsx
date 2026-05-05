import { useCallback, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { ServicesSection } from "./components/ServicesSection";
import { PackagesSection } from "./components/PackagesSection";
import { HowItWorks } from "./components/HowItWorks";
import { BookingSection } from "./components/BookingSection";
import { ServiceArea } from "./components/ServiceArea";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { emptySelection, buildWhatsAppLink } from "./lib/booking";
import type { Selection } from "./lib/booking";
import { defaultConfig, defaultServices, defaultPackages } from "./lib/seedData";

export default function App() {
  // Static content for now — Convex layer is opt-in (see README).
  const config = defaultConfig;
  const services = defaultServices;
  const packages = defaultPackages;

  const [selection, setSelection] = useState<Selection>(emptySelection);

  const toggleService = useCallback((slug: string) => {
    setSelection((s) => {
      const next = new Set(s.serviceSlugs);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return { ...s, serviceSlugs: next };
    });
  }, []);

  const togglePackage = useCallback((slug: string) => {
    setSelection((s) => {
      const next = new Set(s.packageSlugs);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return { ...s, packageSlugs: next };
    });
  }, []);

  const headerWaLink = buildWhatsAppLink(
    `Hi ${config.businessName}, I'd like to ask about a booking.`,
    config.whatsappNumber
  );

  return (
    <>
      <Header whatsappLink={headerWaLink} />
      <main>
        <Hero />
        <TrustStrip />
        <ServicesSection
          services={services}
          selectedSlugs={selection.serviceSlugs}
          onToggle={toggleService}
        />
        <PackagesSection
          packages={packages}
          selectedSlugs={selection.packageSlugs}
          onToggle={togglePackage}
        />
        <HowItWorks />
        <BookingSection
          services={services}
          packages={packages}
          config={config}
          selection={selection}
          setSelection={setSelection}
        />
        <ServiceArea config={config} />
        <Faq />
      </main>
      <Footer config={config} whatsappLink={headerWaLink} />
    </>
  );
}
