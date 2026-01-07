import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mkhize",
    role: "HR Manager, Sasol",
    content: "Therapy on the Go transformed our employee wellness program. Their team is professional, punctual, and our staff love the convenience of on-site health checks.",
    rating: 5,
  },
  {
    name: "James van der Berg",
    role: "Fleet Manager, Transnet",
    content: "Getting our drivers' medicals done has never been easier. They come to our depot, and we have all certificates within 24 hours. Excellent service!",
    rating: 5,
  },
  {
    name: "Nomsa Dlamini",
    role: "Operations Director, Anglo American",
    content: "The medical surveillance program they provide keeps us fully compliant with occupational health regulations. Highly recommend for any mining operation.",
    rating: 5,
  },
  {
    name: "David Pillay",
    role: "Business Owner, Cape Town",
    content: "As a small business owner, I appreciate that they cater to companies of all sizes. Affordable, professional, and thorough health assessments for my team.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground">
            Trusted by thousands of individuals and businesses across South Africa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-soft bg-card hover-lift">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-coral/30 mb-4" />
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-coral text-coral" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
