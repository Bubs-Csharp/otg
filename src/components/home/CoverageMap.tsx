import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";

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

const provincePositions = [
  { x: 200, y: 140, name: "Gauteng" },
  { x: 100, y: 280, name: "Western Cape" },
  { x: 280, y: 200, name: "KZN" },
  { x: 180, y: 260, name: "Eastern Cape" },
  { x: 240, y: 120, name: "Mpumalanga" },
  { x: 200, y: 90, name: "Limpopo" },
  { x: 150, y: 200, name: "Free State" },
  { x: 140, y: 140, name: "North West" },
  { x: 100, y: 200, name: "Northern Cape" },
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
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-soft-teal/30 to-accent flex items-center justify-center">
                  {/* Simplified SA Map Shape */}
                  <svg viewBox="0 0 400 350" className="w-full h-full p-8">
                    {/* South Africa simplified outline */}
                    <path
                      d="M80 120 L120 80 L200 60 L280 70 L340 100 L360 160 L350 220 L320 280 L260 320 L180 330 L120 310 L80 260 L60 200 L70 160 Z"
                      className="fill-primary/20 stroke-primary stroke-2"
                    />
                    {/* Province dots */}
                    {provincePositions.map((province, i) => (
                      <g key={i}>
                        {/* Pulse ring */}
                        <circle
                          cx={province.x}
                          cy={province.y}
                          r="12"
                          className="fill-coral/50 animate-pulse-ring"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                        {/* Main dot */}
                        <circle
                          cx={province.x}
                          cy={province.y}
                          r="8"
                          className="fill-coral"
                        />
                        {/* Inner dot */}
                        <circle
                          cx={province.x}
                          cy={province.y}
                          r="4"
                          className="fill-primary-foreground"
                        />
                      </g>
                    ))}
                  </svg>
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-primary font-medium">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      All 9 provinces covered
                    </p>
                  </div>
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
