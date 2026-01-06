import { Nonprofit } from '@/context/DonationContext';
import { NonprofitCard } from './NonprofitCard';
import { Loader2, SearchX, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NonprofitGridProps {
  nonprofits: Nonprofit[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  isUsingDemoData?: boolean;
}

export function NonprofitGrid({ nonprofits, loading, error, hasSearched, isUsingDemoData }: NonprofitGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-secondary animate-pulse" />
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
        </div>
        <p className="mt-4 text-muted-foreground">Finding nonprofits near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <SearchX className="h-8 w-8 text-destructive" />
        </div>
        <p className="mt-4 text-destructive font-medium">Error loading nonprofits</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  if (nonprofits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 text-foreground font-medium">No nonprofits found</p>
        <p className="text-sm text-muted-foreground">Try a different ZIP code or category</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isUsingDemoData && (
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Showing demo data — the nonprofit database is temporarily unavailable. These are sample organizations for demonstration purposes.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nonprofits.map((nonprofit, index) => (
          <NonprofitCard key={nonprofit.ein} nonprofit={nonprofit} index={index} />
        ))}
      </div>
    </div>
  );
}
