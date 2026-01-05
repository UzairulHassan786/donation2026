import { useState } from 'react';
import { ShoppingCart, Heart, ArrowRight, X, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDonation } from '@/context/DonationContext';
import { toast } from 'sonner';

export function DonationCart() {
  const { donations, totalAmount, donationCount, removeDonation, clearDonations } = useDonation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const platformFee = totalAmount * 0.05;
  const nonprofitTotal = totalAmount * 0.95;

  const handleCheckout = async () => {
    if (donationCount === 0) {
      toast.error('Please select at least one nonprofit to donate to');
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe Connect checkout
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, this would:
    // 1. Create a Stripe Checkout Session with Connect
    // 2. Split payment: 95% to nonprofits, 5% to platform
    // 3. Use transfer_data for each connected account

    const donationDetails = Array.from(donations.values()).map(d => ({
      nonprofit: d.nonprofit.name,
      amount: d.amount,
      share: (d.amount / totalAmount) * nonprofitTotal,
    }));

    console.log('Stripe Connect Payment Split:', {
      totalAmount,
      platformFee,
      nonprofitTotal,
      distributions: donationDetails,
      stripeTestKey: 'rk_test_51HJePhH5GmCPHXBJo929ogopAL7Jywqg5KAKhWQJTze3bLJL14zN6uQpGa7UYG3ZmGeN453dtVbgsNMPTjeW3zgT00vw7eRWJP',
    });

    setIsProcessing(false);
    toast.success('Donation processed successfully!', {
      description: `Thank you for donating $${totalAmount.toFixed(2)} to ${donationCount} nonprofit${donationCount > 1 ? 's' : ''}!`,
    });
    
    clearDonations();
    setIsExpanded(false);
  };

  if (donationCount === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Heart className="h-5 w-5" />
            <span>Select nonprofits above to start your donation</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Expanded cart panel */}
      {isExpanded && (
        <div className="bg-card border-t border-border shadow-elevated animate-slide-up">
          <div className="container mx-auto p-4 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground font-serif text-lg">Your Donations</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {Array.from(donations.values()).map(({ nonprofit, amount }) => (
                <div
                  key={nonprofit.ein}
                  className="flex items-center justify-between p-3 bg-secondary rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{nonprofit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {nonprofit.city}, {nonprofit.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">${amount}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeDonation(nonprofit.ein)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Platform fee (5%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>To nonprofits (95%)</span>
                <span>${nonprofitTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="bg-card/95 backdrop-blur-lg border-t border-border shadow-elevated">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-foreground" />
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {donationCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Total donation</p>
                <p className="text-xl font-bold text-foreground font-serif">${totalAmount.toFixed(2)}</p>
              </div>
            </button>

            <Button
              variant="accent"
              size="xl"
              onClick={handleCheckout}
              disabled={isProcessing}
              className="min-w-[200px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Complete Donation
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
