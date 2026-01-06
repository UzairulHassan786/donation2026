import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ZipSearch } from '@/components/ZipSearch';
import { CategoryTabs } from '@/components/CategoryTabs';
import { NonprofitGrid } from '@/components/NonprofitGrid';
import { DonationCart } from '@/components/DonationCart';
import { DonationProvider } from '@/context/DonationContext';
import { useNonprofits, Category } from '@/hooks/useNonprofits';

function DonationPlatform() {
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('animal');
  const [searchParams, setSearchParams] = useState<{ zipCode: string; radius: number } | null>(null);
  const { nonprofits, loading, error, isUsingDemoData, fetchNonprofits } = useNonprofits();

  const handleSearch = useCallback((zipCode: string, radius: number) => {
    setSearchParams({ zipCode, radius });
    setHasSearched(true);
    fetchNonprofits(zipCode, activeCategory, radius);
  }, [activeCategory, fetchNonprofits]);

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
    if (searchParams) {
      fetchNonprofits(searchParams.zipCode, category, searchParams.radius);
    }
  }, [searchParams, fetchNonprofits]);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <main>
        <HeroSection />

        <section className="container mx-auto px-4 mb-8">
          <ZipSearch onSearch={handleSearch} disabled={loading} />
        </section>

        {hasSearched && (
          <section className="container mx-auto px-4 mb-8 animate-fade-in">
            <CategoryTabs activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          </section>
        )}

        <section className="container mx-auto px-4">
          <NonprofitGrid
            nonprofits={nonprofits}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            isUsingDemoData={isUsingDemoData}
          />
        </section>
      </main>

      <DonationCart />
    </div>
  );
}

const Index = () => {
  return (
    <DonationProvider>
      <DonationPlatform />
    </DonationProvider>
  );
};

export default Index;
