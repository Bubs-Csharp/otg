import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  MapPin, 
  ArrowRight,
  Stethoscope,
  Activity,
  Building2,
  Car
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Medical Surveillance",
    description: "Comprehensive occupational health assessments and monitoring for workplace safety.",
    price: "From R400",
  },
  {
    icon: Activity,
    title: "Wellness Screenings",
    description: "Preventive health checks including blood pressure, glucose, and cholesterol testing.",
    price: "From R350",
  },
  {
    icon: Building2,
    title: "Corporate Health",
    description: "Tailored health programs for businesses of all sizes, delivered on-site.",
    price: "Custom Quote",
  },
  {
    icon: Car,
    title: "Drivers Medicals",
    description: "PrDP and professional driver medical certificates for compliance.",
    price: "From R700",
  },
];

const features = [
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description: "We come to you, anywhere in South Africa",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book appointments that fit your schedule",
  },
  {
    icon: Shield,
    title: "Certified Professionals",
    description: "HPCSA registered healthcare practitioners",
  },
  {
    icon: Users,
    title: "Group Bookings",
    description: "Special rates for corporate and group sessions",
  },
];

const stats = [
  { value: "10,000+", label: "Patients Served" },
  { value: "500+", label: "Corporate Clients" },
  { value: "9", label: "Provinces Covered" },
  { value: "98%", label: "Satisfaction Rate" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
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
                <Button size="lg" className="rounded-full shadow-warm text-base px-8">
                  Book an Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-base px-8">
                  View Services
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

      {/* Stats Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Therapy on the Go?
            </h2>
            <p className="text-muted-foreground">
              We bring professional healthcare services directly to you, 
              eliminating the hassle of clinic visits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-soft hover-lift bg-card">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive healthcare solutions for individuals and businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card 
                key={service.title} 
                className="border-0 shadow-soft hover-lift bg-card group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-coral-light flex items-center justify-center mb-4 group-hover:bg-coral/20 transition-colors">
                    <service.icon className="h-6 w-6 text-coral" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{service.price}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" className="rounded-full">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              size="lg" 
              variant="secondary" 
              className="rounded-full text-base px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
