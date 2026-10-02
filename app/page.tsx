import Hero from './../components/Sections/Hero'
import DashboardShowcase from './../components/Sections/Dashboard';
import IntelligenceSection from '@/components/Sections/Intelligence';
import PricingSection from '@/components/Sections/Pricing';
import Footer from '@/components/Sections/Footer';

export default function GitInsight() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#07090c] text-white">
      <Hero />
      <DashboardShowcase />
      <IntelligenceSection />
      <PricingSection />
      <Footer />
    </div>
  );
}