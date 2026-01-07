import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
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

// Images
import teamGroupImage from "@/assets/images/team-group.jpg";
import onsiteHealthcareImage from "@/assets/images/onsite-healthcare.jpg";
import doctorPortrait from "@/assets/images/doctor-portrait-1.jpg";
import nursePortrait from "@/assets/images/nurse-portrait-1.jpg";
import adminPortrait from "@/assets/images/admin-portrait-1.jpg";
import psychologistPortrait from "@/assets/images/psychologist-portrait-1.jpg";

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
    image: doctorPortrait,
  },
  {
    name: "Sister Precious Nkosi",
    role: "Clinical Lead",
    credentials: "RN, OHN",
    bio: "Specialist occupational health nurse with extensive corporate wellness experience.",
    image: nursePortrait,
  },
  {
    name: "James van Wyk",
    role: "Operations Manager",
    credentials: "BCom, PMP",
    bio: "Ensures seamless service delivery across all provinces with a focus on client satisfaction.",
    image: adminPortrait,
  },
  {
    name: "Dr. Sarah Pillay",
    role: "Wellness Coordinator",
    credentials: "PhD Psychology",
    bio: "Develops holistic wellness programs integrating physical and mental health.",
    image: psychologistPortrait,
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
      <section className="relative py-16 lg:py-24 gradient-soft overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-up">
              <Badge variant="secondary" className="mb-4">About Us</Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Healthcare That Comes to You
              </h1>
              <p className="text-lg text-muted-foreground">
                Since 2010, Therapy on the Go has been revolutionizing healthcare delivery in South Africa. 
                We bring professional medical services directly to homes, offices, and work sites — 
                making quality healthcare accessible to all.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-left" delay={200}>
              <div className="relative">
                <img 
                  src={teamGroupImage} 
                  alt="Our healthcare team" 
                  className="rounded-2xl shadow-warm w-full object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                  <p className="font-display text-3xl font-bold">14+</p>
                  <p className="text-sm opacity-90">Years of Service</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-right">
              <div className="relative">
                <img 
                  src={onsiteHealthcareImage} 
                  alt="On-site healthcare services" 
                  className="rounded-2xl shadow-soft w-full object-cover aspect-[4/3]"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={100}>
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
            </AnimatedSection>
          </div>

          {/* Values Grid */}
          <div className="mt-16 lg:mt-24">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Our Values</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                What Drives Us
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} animation="fade-up" delay={index * 100}>
                  <Card className="border-0 shadow-soft bg-card hover-lift h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-muted/30" id="team">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Our Team</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet the Experts Behind Your Care
            </h2>
            <p className="text-muted-foreground">
              Our leadership team brings decades of combined experience in occupational health, 
              wellness, and healthcare management.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <AnimatedSection key={member.name} animation="fade-up" delay={index * 100}>
                <Card className="border-0 shadow-soft bg-card hover-lift group h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Accreditations</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fully Certified & Compliant
            </h2>
            <p className="text-muted-foreground">
              All our healthcare professionals are registered with the relevant South African regulatory bodies, 
              ensuring you receive care that meets the highest standards.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accreditations.map((acc, index) => (
              <AnimatedSection key={acc.name} animation="scale-in" delay={index * 100}>
                <Card className="border-0 shadow-soft bg-card text-center hover-lift h-full">
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 gradient-warm text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-up">
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
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default About;
