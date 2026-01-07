import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/ui/animated-section";
import heroImage from "@/assets/images/hero-healthcare-team.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-soft">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
                <Heart className="h-4 w-4 text-coral animate-pulse" />
                <span>Healthcare that comes to you</span>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={100}>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Quality Healthcare,{" "}
                <span className="text-primary">Delivered to Your Doorstep</span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={200}>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
                Professional medical services brought directly to your home, office, or event. 
                Convenient, compassionate care across South Africa.
              </p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button asChild size="lg" className="rounded-full shadow-warm text-base px-8 hover-scale">
                  <Link to="/contact">
                    Book an Appointment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full text-base px-8 hover-scale">
                  <Link to="/services">View Services</Link>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>HPCSA Registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>All 9 Provinces</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>24hr Turnaround</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Hero Visual */}
          <AnimatedSection animation="scale-in" delay={200}>
            <div className="relative">
              <div className="relative aspect-[4/3] max-w-lg mx-auto">
                {/* Background decorative elements */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-coral/20 blur-2xl animate-pulse" />
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-warm">
                  <img 
                    src={heroImage} 
                    alt="Professional healthcare team ready to serve you" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-card rounded-xl shadow-soft p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">10,000+</p>
                      <p className="text-xs text-muted-foreground">Patients Served</p>
                    </div>
                  </div>
                </div>

                {/* Second floating badge */}
                <div className="absolute -top-4 -left-4 bg-card rounded-xl shadow-soft p-3 animate-float-slow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-coral" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">98% Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
