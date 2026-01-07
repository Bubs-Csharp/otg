const stats = [
  { value: "10,000+", label: "Patients Served" },
  { value: "500+", label: "Corporate Clients" },
  { value: "9", label: "Provinces Covered" },
  { value: "98%", label: "Satisfaction Rate" },
];

export function StatsSection() {
  return (
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
  );
}
