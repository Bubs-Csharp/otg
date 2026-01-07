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

// Accurate positions based on South Africa's geography
const provincePositions = [
  { x: 280, y: 145, name: "Gauteng" },
  { x: 95, y: 310, name: "Western Cape" },
  { x: 355, y: 210, name: "KZN" },
  { x: 255, y: 285, name: "Eastern Cape" },
  { x: 330, y: 120, name: "Mpumalanga" },
  { x: 295, y: 65, name: "Limpopo" },
  { x: 235, y: 205, name: "Free State" },
  { x: 210, y: 115, name: "North West" },
  { x: 120, y: 195, name: "Northern Cape" },
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
                  <svg viewBox="0 0 420 380" className="w-full h-full p-6">
                    {/* Accurate South Africa outline with provinces */}
                    {/* Main country outline */}
                    <path
                      d="M55 310 Q60 295 70 285 L85 270 Q95 260 100 250 L110 235 Q115 225 120 215 L130 200 Q135 190 140 180 L150 165 Q155 155 165 145 L180 130 Q190 120 205 110 L225 100 Q245 90 265 85 L290 80 Q310 78 330 82 L350 88 Q365 95 375 108 L385 125 Q390 140 388 155 L385 175 Q380 190 370 205 L355 225 Q345 238 340 250 L335 265 Q332 275 335 285 L340 300 Q345 315 340 330 L330 345 Q315 355 295 360 L270 362 Q250 360 230 355 L205 345 Q185 335 170 325 L150 310 Q130 295 110 290 L85 290 Q70 295 60 305 Z"
                      className="fill-primary/15 stroke-primary stroke-2"
                    />
                    {/* Lesotho (enclave) */}
                    <ellipse cx="295" cy="255" rx="18" ry="15" className="fill-muted stroke-primary stroke-1" />
                    {/* Province boundaries - simplified */}
                    <path d="M205 110 L235 175 L280 190 L330 160" className="stroke-primary/40 stroke-1 fill-none" />
                    <path d="M165 145 L195 165 L235 175" className="stroke-primary/40 stroke-1 fill-none" />
                    <path d="M195 165 L180 220 L205 270" className="stroke-primary/40 stroke-1 fill-none" />
                    <path d="M235 175 L240 230 L295 235" className="stroke-primary/40 stroke-1 fill-none" />
                    <path d="M110 235 L180 220" className="stroke-primary/40 stroke-1 fill-none" />
                    <path d="M180 220 L205 270 L270 280" className="stroke-primary/40 stroke-1 fill-none" />
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
