import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/ui/animated-section";

export function CTASection() {
  return (
    <section className="relative py-16 lg:py-24 gradient-warm text-primary-foreground overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <AnimatedSection animation="fade-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Healthcare on Your Terms?
          </h2>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay={100}>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Book your appointment today and let us bring quality healthcare to your doorstep. 
            It's convenient, professional, and designed around your schedule.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              asChild
              size="lg" 
              variant="secondary" 
              className="rounded-full text-base px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover-scale shadow-lg"
            >
              <Link to="/contact">
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="rounded-full text-base px-8 border-white bg-white/10 text-white hover:bg-white/20 hover-scale"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={300}>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/70">
            <a 
              href="tel:+27123456789" 
              className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+27 12 345 6789</span>
            </a>
            <a 
              href="https://wa.me/27821234567" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
