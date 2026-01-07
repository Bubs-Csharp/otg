import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Shield, Users } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";

const features = [
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description: "We come to you, anywhere in South Africa",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book appointments that fit your schedule",
  },
  {
    icon: Shield,
    title: "Certified Professionals",
    description: "HPCSA registered healthcare practitioners",
  },
  {
    icon: Users,
    title: "Group Bookings",
    description: "Special rates for corporate and group sessions",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Therapy on the Go?
          </h2>
          <p className="text-muted-foreground">
            We bring professional healthcare services directly to you, 
            eliminating the hassle of clinic visits.
          </p>
        </AnimatedSection>

        <StaggeredContainer 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          staggerDelay={100}
          animation="fade-up"
        >
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="border-0 shadow-soft hover-lift bg-card group card-press"
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary icon-hover" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
}
