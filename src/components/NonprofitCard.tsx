import { useState, useEffect } from 'react';
import { Check, Plus, Minus, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Nonprofit, useDonation } from '@/context/DonationContext';

interface NonprofitCardProps {
  nonprofit: Nonprofit;
  index: number;
}

export function NonprofitCard({ nonprofit, index }: NonprofitCardProps) {
  const { addDonation, removeDonation, updateDonationAmount, isSelected, getDonationAmount } = useDonation();
  const selected = isSelected(nonprofit.ein);
  const currentAmount = getDonationAmount(nonprofit.ein);
  const [amount, setAmount] = useState(currentAmount || 25);

  useEffect(() => {
    if (selected && currentAmount) {
      setAmount(currentAmount);
    }
  }, [selected, currentAmount]);

  const handleToggle = () => {
    if (selected) {
      removeDonation(nonprofit.ein);
    } else {
      addDonation(nonprofit, amount);
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setAmount(numValue);
    if (selected) {
      updateDonationAmount(nonprofit.ein, numValue);
    }
  };

  const adjustAmount = (delta: number) => {
    const newAmount = Math.max(0, amount + delta);
    setAmount(newAmount);
    if (selected) {
      updateDonationAmount(nonprofit.ein, newAmount);
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div
      className={`relative rounded-2xl border-2 p-5 transition-all duration-300 animate-slide-up ${
        selected
          ? 'border-primary bg-primary/5 shadow-card'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-soft'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-soft animate-scale-in">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight mb-2">
            {nonprofit.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{nonprofit.city}, {nonprofit.state}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>Income: {formatCurrency(nonprofit.income_amount)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-1 bg-secondary rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => adjustAmount(-5)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="h-9 text-center pl-7 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => adjustAmount(5)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant={selected ? 'default' : 'outline'}
            onClick={handleToggle}
            className="h-11 px-4"
          >
            {selected ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
