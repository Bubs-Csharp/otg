import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";
import SouthAfricaMap from "@/assets/images/south-africa-map.svg";

const provinces = [
  { name: "Gauteng", active: true, cities: ["Johannesburg", "Pretoria", "Centurion"] },
  { name: "Western Cape", active: true, cities: ["Cape Town", "Stellenbosch", "Paarl"] },
  { name: "KwaZulu-Natal", active: true, cities: ["Durban", "Pietermaritzburg", "Richards Bay"] },
  { name: "Eastern Cape", active: true, cities: ["Port Elizabeth", "East London"] },
  { name: "Mpumalanga", active: true, cities: ["Nelspruit", "Witbank"] },
  { name: "Limpopo", active: true, cities: ["Polokwane", "Tzaneen"] },
  { name: "Free State", active: true, cities: ["Bloemfontein", "Welkom"] },
  { name: "North West", active: true, cities: ["Rustenburg", "Potchefstroom"] },
  { name: "Northern Cape", active: true, cities: ["Kimberley", "Upington"] },
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

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Map Visualization */}
          <AnimatedSection animation="scale-in" delay={100}>
            <Card className="border-0 shadow-soft bg-card overflow-hidden">
              <CardContent className="p-8">
                <div className="relative flex items-center justify-center">
                  <img 
                    src={SouthAfricaMap} 
                    alt="South Africa coverage map showing all 9 provinces" 
                    className="w-full max-w-md h-auto object-contain"
                    style={{
                      filter: 'hue-rotate(140deg) saturate(0.7) brightness(1.1)'
                    }}
                  />
                </div>
                <div className="text-center mt-6 space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">All 9 provinces covered</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Mobile healthcare services nationwide</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Province List */}
          <div className="space-y-4">
            <AnimatedSection animation="fade-left">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Service Areas by Province
              </h3>
            </AnimatedSection>
            <StaggeredContainer className="grid gap-3" staggerDelay={50} animation="fade-left">
              {provinces.map((province) => (
                <Card key={province.name} className="border-0 shadow-soft bg-card hover-lift">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{province.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {province.cities.join(" • ")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">Active</Badge>
                  </CardContent>
                </Card>
              ))}
            </StaggeredContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
