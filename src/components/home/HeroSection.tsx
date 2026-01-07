import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-soft">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Heart className="h-4 w-4 text-coral" />
              <span>Healthcare that comes to you</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Quality Healthcare,{" "}
              <span className="text-primary">Delivered to Your Doorstep</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Professional medical services brought directly to your home, office, or event. 
              Convenient, compassionate care across South Africa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full shadow-warm text-base px-8">
                <Link to="/contact">
                  Book an Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full text-base px-8">
                <Link to="/services">View Services</Link>
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background decorative elements */}
              <div className="absolute inset-0 rounded-full bg-soft-teal/50 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-accent" />
              <div className="absolute inset-8 rounded-full bg-card shadow-warm flex items-center justify-center">
                <div className="text-center p-8">
                  <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="font-display text-xl font-semibold text-foreground">
                    Your Health, Our Priority
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Professional care, anywhere you are
                  </p>
                </div>
              </div>
            </div>
          </div>
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
