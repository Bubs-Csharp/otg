import { CounterAnimation } from "@/components/ui/counter-animation";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";

const stats = [
  { value: 10000, suffix: "+", label: "Patients Served" },
  { value: 500, suffix: "+", label: "Corporate Clients" },
  { value: 9, suffix: "", label: "Provinces Covered" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <StaggeredContainer 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          staggerDelay={100}
          animation="fade-up"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                <CounterAnimation 
                  value={stat.value} 
                  suffix={stat.suffix}
                  duration={2000}
                />
              </p>
              <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
}
