import Hero from "@/components/Sections/Hero";
import IntelligenceSection from "@/components/Sections/Intelligence";
import DashboardShowcase from "@/components/Sections/Dashboard";
import PricingSection from "@/components/Sections/Pricing";
import Footer from "@/components/Sections/Footer";

export default function GitInsight() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#07080b] text-white">
      <Hero />
      <IntelligenceSection />
      <DashboardShowcase />
      <PricingSection />
      <Footer />
    </div>
  );
}
