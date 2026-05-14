import Hero from './../components/Sections/Hero'
import DashboardShowcase from './../components/Sections/Dashboard';
import IntelligenceSection from '@/components/Sections/Intelligence';
import PricingSection from '@/components/Sections/Pricing';
import Footer from '@/components/Sections/Footer';

export default function GitInsight() {
  return (
    <div className="flex flex-col w-screen items-center justify-between p-24 pb-0">
      <Hero />
      <DashboardShowcase />
      <IntelligenceSection />
      <PricingSection />
      <Footer />
    </div>
  );
}