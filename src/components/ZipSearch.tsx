import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ZipSearchProps {
  onSearch: (zipCode: string, radius: number) => void;
  disabled?: boolean;
}

const RADIUS_OPTIONS = [25, 50, 100];

export function ZipSearch({ onSearch, disabled }: ZipSearchProps) {
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length === 5) {
      onSearch(zipCode, radius);
    }
  };

  const isValid = zipCode.length === 5 && /^\d+$/.test(zipCode);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Enter your ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="h-14 pl-12 pr-32 text-lg rounded-2xl shadow-soft focus:shadow-card"
            disabled={disabled}
          />
          <Button
            type="submit"
            disabled={!isValid || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-xl"
            variant="accent"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Radius:</span>
          <div className="flex gap-1 bg-secondary rounded-xl p-1">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadius(r)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  radius === r
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r} mi
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
