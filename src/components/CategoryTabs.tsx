import { Category } from '@/hooks/useNonprofits';
import { Leaf, GraduationCap, Heart, Church, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { 
    id: 'animal', 
    label: 'Animal & Environment', 
    icon: <Leaf className="h-5 w-5" />,
    color: 'bg-category-animal'
  },
  { 
    id: 'education', 
    label: 'Education & Democracy', 
    icon: <GraduationCap className="h-5 w-5" />,
    color: 'bg-category-education'
  },
  { 
    id: 'human', 
    label: 'Human Services', 
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-category-human'
  },
  { 
    id: 'society', 
    label: 'Society & Religion', 
    icon: <Church className="h-5 w-5" />,
    color: 'bg-category-society'
  },
  { 
    id: 'arts', 
    label: 'Arts & Culture', 
    icon: <Palette className="h-5 w-5" />,
    color: 'bg-category-arts'
  },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'categoryActive' : 'category'}
            onClick={() => onCategoryChange(cat.id)}
            className="flex items-center gap-2 px-4 py-6 md:px-6"
          >
            <span className={`p-1.5 rounded-lg ${activeCategory === cat.id ? 'bg-primary-foreground/20' : cat.color + '/10'}`}>
              {cat.icon}
            </span>
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
