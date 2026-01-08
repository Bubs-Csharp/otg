import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, Stethoscope, Activity, Building2, Car, HeartPulse, Eye, Syringe, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/ui/animated-section";

const services = [
  {
    icon: Stethoscope,
    title: "Medical Surveillance",
    description: "Comprehensive occupational health assessments and monitoring for workplace safety compliance.",
    price: "From R400",
    duration: "30-45 min",
  },
  {
    icon: Activity,
    title: "Wellness Screenings",
    description: "Preventive health checks including blood pressure, glucose, cholesterol, and BMI testing.",
    price: "From R350",
    duration: "20-30 min",
  },
  {
    icon: Building2,
    title: "Corporate Health",
    description: "Tailored health programs for businesses of all sizes, delivered conveniently on-site.",
    price: "Custom Quote",
    duration: "Varies",
  },
  {
    icon: Car,
    title: "Drivers Medicals",
    description: "PrDP and professional driver medical certificates for legal compliance.",
    price: "From R700",
    duration: "45 min",
  },
  {
    icon: HeartPulse,
    title: "Executive Health",
    description: "Premium comprehensive health assessments for executives and management teams.",
    price: "From R2,500",
    duration: "90 min",
  },
  {
    icon: Eye,
    title: "Vision Screening",
    description: "Eye tests and vision screening for workplace safety and driver compliance.",
    price: "From R150",
    duration: "15 min",
  },
  {
    icon: Syringe,
    title: "Vaccinations",
    description: "Flu shots, hepatitis, and other workplace-required vaccinations administered on-site.",
    price: "From R200",
    duration: "10 min",
  },
  {
    icon: FileCheck,
    title: "Cervical Screening",
    description: "Women's health screenings including pap smears conducted with care and privacy.",
    price: "From R400",
    duration: "20 min",
  },
];

export function ServicesCarousel() {
  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground">
            Comprehensive healthcare solutions for individuals and businesses
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {services.map((service, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Link to="/services" className="block h-full">
                    <Card className="border-0 shadow-soft hover-lift bg-card group cursor-pointer h-full card-press">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-xl bg-coral-light flex items-center justify-center mb-4 group-hover:bg-coral/20 transition-colors group-hover:scale-110 transform duration-300">
                          <service.icon className="h-6 w-6 text-coral" />
                        </div>
                        <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          {service.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{service.duration}</span>
                            <span className="font-semibold text-primary">{service.price}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="static translate-y-0 hover-scale" />
              <CarouselNext className="static translate-y-0 hover-scale" />
            </div>
          </Carousel>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={300} className="text-center mt-10">
          <Button asChild size="lg" variant="outline" className="rounded-full hover-scale">
            <Link to="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
