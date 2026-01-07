import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { 
  Stethoscope, 
  Activity, 
  Building2, 
  Car, 
  HeartPulse, 
  Eye, 
  Syringe, 
  FileCheck,
  Ear,
  Wind,
  Brain,
  Droplets,
  ArrowRight,
  Clock,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Images
import corporateWellnessImage from "@/assets/images/corporate-wellness.jpg";
import medicalEquipmentImage from "@/assets/images/medical-equipment.jpg";

const categories = [
  { id: "all", name: "All Services" },
  { id: "medical", name: "Medical Surveillance" },
  { id: "wellness", name: "Wellness" },
  { id: "corporate", name: "Corporate" },
  { id: "drivers", name: "Drivers" },
];

const services = [
  {
    icon: Stethoscope,
    title: "Occupational Health Assessments",
    description: "Comprehensive pre-employment, periodic, and exit medical examinations for workplace compliance.",
    price: "From R400",
    duration: "30-45 min",
    category: "medical",
    features: ["Medical history review", "Physical examination", "Fitness certificate"],
  },
  {
    icon: Activity,
    title: "Wellness Screenings",
    description: "Preventive health checks including blood pressure, glucose, cholesterol, and BMI assessments.",
    price: "From R350",
    duration: "20-30 min",
    category: "wellness",
    features: ["Blood pressure check", "Glucose testing", "Cholesterol screening", "BMI calculation"],
  },
  {
    icon: Building2,
    title: "Corporate Health Programs",
    description: "Tailored health and wellness programs for businesses, delivered conveniently at your workplace.",
    price: "Custom Quote",
    duration: "Varies",
    category: "corporate",
    features: ["On-site service", "Customized programs", "Health reports", "Follow-up support"],
  },
  {
    icon: Car,
    title: "Drivers Medicals (PrDP)",
    description: "Professional driver permit medical examinations for public transport and goods vehicle operators.",
    price: "From R700",
    duration: "45 min",
    category: "drivers",
    features: ["Vision test", "Physical exam", "PrDP certificate", "Same-day results"],
  },
  {
    icon: HeartPulse,
    title: "Executive Health Assessments",
    description: "Premium comprehensive health evaluations designed for executives and senior management.",
    price: "From R2,500",
    duration: "90 min",
    category: "wellness",
    features: ["Full body assessment", "Cardiac risk profiling", "Stress evaluation", "Lifestyle coaching"],
  },
  {
    icon: Eye,
    title: "Vision Screening",
    description: "Eye tests and vision screening for workplace safety requirements and driver compliance.",
    price: "From R150",
    duration: "15 min",
    category: "medical",
    features: ["Visual acuity test", "Color blindness test", "Depth perception", "Peripheral vision"],
  },
  {
    icon: Syringe,
    title: "Vaccinations",
    description: "Flu shots, hepatitis, tetanus, and other workplace-required vaccinations administered on-site.",
    price: "From R200",
    duration: "10 min",
    category: "wellness",
    features: ["Flu vaccines", "Hepatitis A & B", "Tetanus", "Travel vaccines"],
  },
  {
    icon: FileCheck,
    title: "Cervical Screening",
    description: "Women's health screenings including pap smears, conducted with care and complete privacy.",
    price: "From R400",
    duration: "20 min",
    category: "wellness",
    features: ["Pap smear", "Breast examination", "Health counseling", "Confidential results"],
  },
  {
    icon: Ear,
    title: "Audiometry Testing",
    description: "Hearing tests for noise-exposed workers and occupational health compliance.",
    price: "From R250",
    duration: "20 min",
    category: "medical",
    features: ["Pure tone audiometry", "Baseline testing", "Annual monitoring", "Hearing conservation"],
  },
  {
    icon: Wind,
    title: "Spirometry Testing",
    description: "Lung function tests for workers exposed to dust, fumes, or respiratory hazards.",
    price: "From R300",
    duration: "15 min",
    category: "medical",
    features: ["FVC measurement", "FEV1 testing", "Baseline records", "Trend analysis"],
  },
  {
    icon: Brain,
    title: "Mental Health Assessments",
    description: "Psychological wellness evaluations and stress assessments for employee wellbeing.",
    price: "From R500",
    duration: "45 min",
    category: "wellness",
    features: ["Stress assessment", "Anxiety screening", "Counseling referrals", "Confidential support"],
  },
  {
    icon: Droplets,
    title: "Drug & Alcohol Testing",
    description: "Workplace substance testing for safety-critical environments and compliance requirements.",
    price: "From R350",
    duration: "15 min",
    category: "corporate",
    features: ["Urine screening", "Breathalyzer testing", "Chain of custody", "MRO services"],
  },
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={medicalEquipmentImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up" className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">Our Services</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Comprehensive Healthcare Solutions
            </h1>
            <p className="text-lg text-muted-foreground">
              From individual wellness checks to enterprise-wide health programs, 
              we deliver professional medical services tailored to your needs.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={cn(
                  "rounded-full transition-all duration-300",
                  activeCategory === category.id && "shadow-warm scale-105"
                )}
                onClick={() => setActiveCategory(category.id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <AnimatedSection 
                key={`${activeCategory}-${index}`} 
                animation="fade-up" 
                delay={index * 75}
              >
                <Card className="border-0 shadow-soft bg-card hover-lift group h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-coral-light flex items-center justify-center flex-shrink-0 group-hover:bg-coral/20 group-hover:scale-110 transition-all duration-300">
                        <service.icon className="h-7 w-7 text-coral" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-6 flex-grow">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <span className="font-display font-bold text-xl text-primary">
                        {service.price}
                      </span>
                      <Button asChild className="rounded-full group-hover:shadow-warm transition-shadow">
                        <Link to="/contact">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate CTA */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <Card className="border-0 shadow-warm bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="p-8 lg:p-12">
                    <Badge variant="secondary" className="mb-4">Corporate Solutions</Badge>
                    <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                      Tailored Health Programs for Your Business
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      We work with companies of all sizes to create customized health and wellness programs. 
                      From mining sites to corporate offices, we bring healthcare to your workplace.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {["Flexible scheduling around your operations", "Bulk pricing for large groups", "Comprehensive reporting and analytics", "Dedicated account management"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild size="lg" className="rounded-full">
                      <Link to="/contact">
                        Request Corporate Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="relative h-64 lg:h-auto">
                    <img 
                      src={corporateWellnessImage} 
                      alt="Corporate wellness programs" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-primary/60 to-transparent flex items-center justify-center">
                      <div className="text-center text-primary-foreground p-8">
                        <Building2 className="h-16 w-16 mx-auto mb-4 opacity-90" />
                        <p className="font-display text-4xl font-bold mb-2">500+</p>
                        <p className="text-lg opacity-90">Corporate Clients Trust Us</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
