import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check, Building2, Truck, Users } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";

const coverageHighlights = [
  {
    icon: MapPin,
    title: "All 9 Provinces",
    description: "Complete coverage across South Africa, from urban centers to remote locations.",
  },
  {
    icon: Building2,
    title: "Corporate Sites",
    description: "On-site services at offices, factories, and industrial facilities.",
  },
  {
    icon: Truck,
    title: "Mobile Clinics",
    description: "Fully-equipped mobile units that come directly to your location.",
  },
  {
    icon: Users,
    title: "500+ Companies",
    description: "Trusted by leading organizations across all industries.",
  },
];

const provinces = [
  "Gauteng",
  "Western Cape", 
  "KwaZulu-Natal",
  "Eastern Cape",
  "Mpumalanga",
  "Limpopo",
  "Free State",
  "North West",
  "Northern Cape",
];

export function CoverageMap() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">Nationwide Service</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            We Cover All of South Africa
          </h2>
          <p className="text-muted-foreground">
            From the bustling cities to remote mining sites, our mobile healthcare teams reach you wherever you are
          </p>
        </AnimatedSection>

        {/* Coverage Highlights */}
        <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" staggerDelay={100} animation="fade-up">
          {coverageHighlights.map((highlight) => (
            <Card key={highlight.title} className="border-0 shadow-soft bg-card hover-lift text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <highlight.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </StaggeredContainer>

        {/* Province Tags */}
        <AnimatedSection animation="fade-up" delay={200}>
          <Card className="border-0 shadow-soft bg-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Active in All Provinces
                </h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {provinces.map((province) => (
                  <div
                    key={province}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{province}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}
