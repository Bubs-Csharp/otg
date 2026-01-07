import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";

const provinces = [
  { id: "gauteng", name: "Gauteng", active: true, cities: ["Johannesburg", "Pretoria", "Centurion"] },
  { id: "western-cape", name: "Western Cape", active: true, cities: ["Cape Town", "Stellenbosch", "Paarl"] },
  { id: "kwazulu-natal", name: "KwaZulu-Natal", active: true, cities: ["Durban", "Pietermaritzburg", "Richards Bay"] },
  { id: "eastern-cape", name: "Eastern Cape", active: true, cities: ["Port Elizabeth", "East London"] },
  { id: "mpumalanga", name: "Mpumalanga", active: true, cities: ["Nelspruit", "Witbank"] },
  { id: "limpopo", name: "Limpopo", active: true, cities: ["Polokwane", "Tzaneen"] },
  { id: "free-state", name: "Free State", active: true, cities: ["Bloemfontein", "Welkom"] },
  { id: "north-west", name: "North West", active: true, cities: ["Rustenburg", "Potchefstroom"] },
  { id: "northern-cape", name: "Northern Cape", active: true, cities: ["Kimberley", "Upington"] },
];

// Accurate South Africa province SVG paths
const provincePaths: Record<string, { path: string; labelX: number; labelY: number }> = {
  "limpopo": {
    path: "M280,45 L320,35 L365,45 L380,70 L370,100 L340,115 L310,110 L280,120 L255,105 L250,75 L260,55 Z",
    labelX: 310, labelY: 75
  },
  "mpumalanga": {
    path: "M310,110 L340,115 L370,100 L385,120 L380,150 L350,165 L320,160 L295,145 L280,120 Z",
    labelX: 335, labelY: 135
  },
  "gauteng": {
    path: "M255,105 L280,120 L295,145 L280,155 L255,150 L245,130 L250,110 Z",
    labelX: 265, labelY: 130
  },
  "north-west": {
    path: "M175,95 L210,85 L250,75 L255,105 L250,110 L245,130 L255,150 L240,170 L200,175 L165,155 L150,120 Z",
    labelX: 200, labelY: 130
  },
  "free-state": {
    path: "M165,155 L200,175 L240,170 L255,150 L280,155 L295,180 L280,220 L240,250 L200,250 L160,230 L150,195 Z",
    labelX: 215, labelY: 205
  },
  "kwazulu-natal": {
    path: "M280,155 L320,160 L350,165 L380,150 L395,175 L380,220 L340,260 L300,265 L270,240 L280,220 L295,180 Z",
    labelX: 330, labelY: 210
  },
  "eastern-cape": {
    path: "M160,230 L200,250 L240,250 L280,220 L270,240 L300,265 L280,300 L230,320 L170,310 L130,280 L120,250 Z",
    labelX: 210, labelY: 280
  },
  "northern-cape": {
    path: "M50,120 L100,90 L150,90 L175,95 L150,120 L165,155 L150,195 L160,230 L120,250 L80,260 L40,240 L25,200 L30,150 Z",
    labelX: 90, labelY: 175
  },
  "western-cape": {
    path: "M40,240 L80,260 L120,250 L130,280 L170,310 L150,340 L100,350 L50,330 L25,290 L30,260 Z",
    labelX: 95, labelY: 300
  },
};

export function CoverageMap() {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

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
                  <svg viewBox="0 0 420 380" className="w-full h-full p-6">
                    {/* Ocean/background */}
                    <rect x="0" y="0" width="420" height="380" className="fill-primary/5" />
                    
                    {/* Province shapes */}
                    {Object.entries(provincePaths).map(([id, { path, labelX, labelY }]) => {
                      const isHovered = hoveredProvince === id;
                      const province = provinces.find(p => p.id === id);
                      
                      return (
                        <g key={id}>
                          {/* Province path */}
                          <path
                            d={path}
                            className={`
                              transition-all duration-300 cursor-pointer stroke-2
                              ${isHovered 
                                ? "fill-coral stroke-coral/80 drop-shadow-lg" 
                                : "fill-primary/30 stroke-primary/60 hover:fill-primary/50"
                              }
                            `}
                            onMouseEnter={() => setHoveredProvince(id)}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />
                          
                          {/* Province label */}
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            className={`
                              text-[8px] font-semibold pointer-events-none transition-all duration-300
                              ${isHovered ? "fill-white" : "fill-primary"}
                            `}
                          >
                            {province?.name.split(" ").map((word, i) => (
                              <tspan key={i} x={labelX} dy={i === 0 ? 0 : 10}>
                                {id === "kwazulu-natal" ? (i === 0 ? "KwaZulu" : "Natal") : word}
                              </tspan>
                            ))}
                          </text>
                          
                          {/* Pulse indicator when hovered */}
                          {isHovered && (
                            <>
                              <circle
                                cx={labelX}
                                cy={labelY + 15}
                                r="8"
                                className="fill-white/50 animate-ping"
                              />
                              <circle
                                cx={labelX}
                                cy={labelY + 15}
                                r="4"
                                className="fill-white"
                              />
                            </>
                          )}
                        </g>
                      );
                    })}
                    
                    {/* Lesotho (enclave) */}
                    <ellipse
                      cx="250"
                      cy="255"
                      rx="20"
                      ry="15"
                      className="fill-muted stroke-muted-foreground/30 stroke-1"
                    />
                    <text x="250" y="258" textAnchor="middle" className="text-[6px] fill-muted-foreground">
                      Lesotho
                    </text>
                  </svg>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-primary font-medium bg-background/80 backdrop-blur-sm rounded-full py-2 px-4 inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {hoveredProvince 
                        ? `${provinces.find(p => p.id === hoveredProvince)?.name} - Active Coverage`
                        : "Hover over a province for details"
                      }
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
                <Card 
                  key={province.id} 
                  className={`
                    border-0 shadow-soft bg-card hover-lift cursor-pointer transition-all duration-300
                    ${hoveredProvince === province.id ? "ring-2 ring-coral bg-coral/5" : ""}
                  `}
                  onMouseEnter={() => setHoveredProvince(province.id)}
                  onMouseLeave={() => setHoveredProvince(null)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300
                      ${hoveredProvince === province.id ? "bg-coral text-white" : "bg-primary/10"}
                    `}>
                      <Check className={`h-5 w-5 ${hoveredProvince === province.id ? "text-white" : "text-primary"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{province.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {province.cities.join(" • ")}
                      </p>
                    </div>
                    <Badge 
                      variant={hoveredProvince === province.id ? "default" : "secondary"} 
                      className={`flex-shrink-0 transition-colors duration-300 ${
                        hoveredProvince === province.id ? "bg-coral text-white" : ""
                      }`}
                    >
                      Active
                    </Badge>
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