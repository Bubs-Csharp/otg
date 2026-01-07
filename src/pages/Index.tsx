import { Layout } from "@/components/layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ServicesCarousel } from "@/components/home/ServicesCarousel";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CoverageMap } from "@/components/home/CoverageMap";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ServicesCarousel />
      <TrustIndicators />
      <TestimonialsSection />
      <CoverageMap />
      <CTASection />
    </Layout>
  );
};

export default Index;
