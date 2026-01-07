import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Target, 
  Eye, 
  Users, 
  Award, 
  Shield, 
  GraduationCap, 
  Building,
  Mail,
  Linkedin,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We treat every patient with dignity, respect, and genuine care for their wellbeing.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We maintain the highest standards of professional healthcare delivery.",
  },
  {
    icon: Eye,
    title: "Accessibility",
    description: "We believe quality healthcare should be available to everyone, everywhere.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We're committed to improving the health of South African communities.",
  },
];

const team = [
  {
    name: "Dr. Thandi Mokoena",
    role: "Medical Director",
    credentials: "MBChB, DOH",
    bio: "20+ years in occupational health with expertise in mining and industrial medicine.",
  },
  {
    name: "Sister Precious Nkosi",
    role: "Clinical Lead",
    credentials: "RN, OHN",
    bio: "Specialist occupational health nurse with extensive corporate wellness experience.",
  },
  {
    name: "James van Wyk",
    role: "Operations Manager",
    credentials: "BCom, PMP",
    bio: "Ensures seamless service delivery across all provinces with a focus on client satisfaction.",
  },
  {
    name: "Dr. Sarah Pillay",
    role: "Wellness Coordinator",
    credentials: "PhD Psychology",
    bio: "Develops holistic wellness programs integrating physical and mental health.",
  },
];

const accreditations = [
  { icon: Shield, name: "HPCSA", description: "Health Professions Council of SA" },
  { icon: Award, name: "SACSSP", description: "SA Council for Social Service Professions" },
  { icon: GraduationCap, name: "SANC", description: "South African Nursing Council" },
  { icon: Building, name: "DOL Approved", description: "Department of Labour Authorized" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 gradient-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">About Us</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Healthcare That Comes to You
            </h1>
            <p className="text-lg text-muted-foreground">
              Since 2010, Therapy on the Go has been revolutionizing healthcare delivery in South Africa. 
              We bring professional medical services directly to homes, offices, and work sites — 
              making quality healthcare accessible to all.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Our Mission</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Making Healthcare Accessible for Every South African
              </h2>
              <p className="text-muted-foreground mb-6">
                We believe that location should never be a barrier to quality healthcare. 
                Our mobile medical teams travel across all nine provinces, bringing essential 
                health services to communities, corporations, and individuals who need them most.
              </p>
              <p className="text-muted-foreground mb-8">
                From medical surveillance for mine workers to executive wellness programs, 
                we deliver comprehensive healthcare solutions that meet the highest professional standards — 
                all at your convenience.
              </p>
              <Button asChild className="rounded-full">
                <Link to="/services">
                  Explore Our Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value) => (
                <Card key={value.title} className="border-0 shadow-soft bg-card">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-muted/30" id="team">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Our Team</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet the Experts Behind Your Care
            </h2>
            <p className="text-muted-foreground">
              Our leadership team brings decades of combined experience in occupational health, 
              wellness, and healthcare management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="border-0 shadow-soft bg-card hover-lift group">
                <CardContent className="p-6 text-center">
                  {/* Avatar placeholder */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-coral mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-3">{member.credentials}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Accreditations</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fully Certified & Compliant
            </h2>
            <p className="text-muted-foreground">
              All our healthcare professionals are registered with the relevant South African regulatory bodies, 
              ensuring you receive care that meets the highest standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accreditations.map((acc) => (
              <Card key={acc.name} className="border-0 shadow-soft bg-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <acc.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-primary mb-2">
                    {acc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{acc.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 gradient-warm text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Whether you're an individual seeking convenient healthcare or a business looking for 
            comprehensive wellness solutions, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="rounded-full text-base px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="rounded-full text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
