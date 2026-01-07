import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, GraduationCap, Building } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";
import { CounterAnimation } from "@/components/ui/counter-animation";

const accreditations = [
  {
    icon: Shield,
    name: "HPCSA",
    fullName: "Health Professions Council of South Africa",
    description: "All practitioners registered and in good standing",
  },
  {
    icon: Award,
    name: "SACSSP",
    fullName: "SA Council for Social Service Professions",
    description: "Certified social work professionals",
  },
  {
    icon: GraduationCap,
    name: "SANC",
    fullName: "South African Nursing Council",
    description: "Registered nursing practitioners",
  },
  {
    icon: Building,
    name: "DOL Approved",
    fullName: "Department of Labour Approved",
    description: "Authorized occupational health provider",
  },
];

const teamHighlights = [
  { value: 50, suffix: "+", label: "Healthcare Professionals" },
  { value: 15, suffix: "+", label: "Years Combined Experience" },
  { value: 100, suffix: "%", label: "Qualified & Certified" },
];

export function TrustIndicators() {
  return (
    <section className="py-16 lg:py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">Trusted & Certified</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Accreditations
          </h2>
          <p className="text-muted-foreground">
            Our team consists of fully qualified healthcare professionals registered with all relevant South African health bodies
          </p>
        </AnimatedSection>

        {/* Accreditations */}
        <StaggeredContainer 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          staggerDelay={100}
          animation="fade-up"
        >
          {accreditations.map((acc) => (
            <Card key={acc.name} className="border-0 shadow-soft bg-card text-center hover-lift group">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <acc.icon className="h-7 w-7 text-primary icon-hover" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-1">
                  {acc.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">{acc.fullName}</p>
                <p className="text-sm text-foreground">{acc.description}</p>
              </CardContent>
            </Card>
          ))}
        </StaggeredContainer>

        {/* Team Highlights */}
        <AnimatedSection animation="fade-up" delay={300}>
          <Card className="border-0 shadow-warm bg-card">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {teamHighlights.map((item, index) => (
                  <div key={item.label} className="group">
                    <p className="font-display text-4xl font-bold text-coral mb-2">
                      <CounterAnimation 
                        value={item.value} 
                        suffix={item.suffix}
                        duration={2000 + index * 200}
                      />
                    </p>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.label}
                    </p>
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
