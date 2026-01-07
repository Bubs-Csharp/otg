import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 gradient-warm text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Ready to Experience Healthcare on Your Terms?
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          Book your appointment today and let us bring quality healthcare to your doorstep. 
          It's convenient, professional, and designed around your schedule.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            size="lg" 
            variant="secondary" 
            className="rounded-full text-base px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
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
            className="rounded-full text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
