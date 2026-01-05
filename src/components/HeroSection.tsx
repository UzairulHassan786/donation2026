import { Heart, Users, Globe } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="h-4 w-4" fill="currentColor" />
            Make a difference today
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up font-serif leading-tight">
          Support Local Nonprofits
          <br />
          <span className="text-primary">In Your Community</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
          Discover and donate to verified nonprofits near you. 
          Your contribution makes a real impact in the causes you care about.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">1M+ Nonprofits</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">All 50 States</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" fill="currentColor" />
            </div>
            <span className="font-medium">95% to Nonprofits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
