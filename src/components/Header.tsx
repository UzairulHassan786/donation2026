import { Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-soft">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground font-serif">GiveLocal</h1>
              <p className="text-xs text-muted-foreground">Support your community</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
