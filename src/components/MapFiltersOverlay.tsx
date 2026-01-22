import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { foodTags, hoodTags, moodTags } from '@/data/tags';
import { X } from 'lucide-react';

type MapFiltersOverlayProps = {
  className?: string;
  onSelectFoodTag?: (tag: string) => void;
  onSelectMoodTag?: (tag: string) => void;
  onSelectHoodTag?: (tag: string) => void;
};

type FilterVariant = 'food' | 'mood' | 'hood';

function TagDropdown({
  label,
  tags,
  onSelect,
  selected,
  variant,
}: {
  label: string;
  tags: string[];
  onSelect?: (tag: string) => void;
  selected: boolean;
  variant: FilterVariant;
}) {
  const variantClasses: Record<FilterVariant, string> = {
    // Default: filled category color.
    // Hover/Focus/Active: white background with a category-colored border and dark text.
    food:
      'bg-food text-food-foreground border-transparent hover:bg-background hover:text-foreground hover:border-food focus-visible:bg-background focus-visible:text-foreground focus-visible:border-food',
    mood:
      'bg-mood text-mood-foreground border-transparent hover:bg-background hover:text-foreground hover:border-mood focus-visible:bg-background focus-visible:text-foreground focus-visible:border-mood',
    hood:
      'bg-hood text-hood-foreground border-transparent hover:bg-background hover:text-foreground hover:border-hood focus-visible:bg-background focus-visible:text-foreground focus-visible:border-hood',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'rounded-none border-2',
            variantClasses[variant],
            selected && 'bg-background text-foreground',
          )}
        >
          <span className="tracking-wide">{label}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="z-[2000] max-h-[50vh] w-56 overflow-auto bg-popover"
      >
        {tags.length === 0 ? (
          <DropdownMenuItem disabled>(No tags)</DropdownMenuItem>
        ) : (
          <>
            {tags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onSelect={() => {
                  onSelect?.(tag);
                }}
              >
                {tag}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              key="__all__"
              onSelect={() => {
                onSelect?.('All');
              }}
            >
              All
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const MapFiltersOverlay = ({
  className,
  onSelectFoodTag,
  onSelectMoodTag,
  onSelectHoodTag,
}: MapFiltersOverlayProps) => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedHood, setSelectedHood] = useState<string | null>(null);

  const hasAnySelection = selectedFood !== null || selectedMood !== null || selectedHood !== null;

  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-0 z-[1500] pointer-events-none',
        className,
      )}
    >
      <div className="pointer-events-auto px-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <TagDropdown
            label="FOOD"
            tags={foodTags}
            selected={selectedFood !== null}
            variant="food"
            onSelect={(tag) => {
              if (tag === 'All') {
                setSelectedFood(null);
              } else {
                setSelectedFood(tag);
              }
              onSelectFoodTag?.(tag);
            }}
          />

          <TagDropdown
            label="MOOD"
            tags={moodTags}
            selected={selectedMood !== null}
            variant="mood"
            onSelect={(tag) => {
              if (tag === 'All') {
                setSelectedMood(null);
              } else {
                setSelectedMood(tag);
              }
              onSelectMoodTag?.(tag);
            }}
          />

          <TagDropdown
            label="HOOD"
            tags={hoodTags}
            selected={selectedHood !== null}
            variant="hood"
            onSelect={(tag) => {
              if (tag === 'All') {
                setSelectedHood(null);
              } else {
                setSelectedHood(tag);
              }
              onSelectHoodTag?.(tag);
            }}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Clear all filters"
            disabled={!hasAnySelection}
            onClick={() => {
              setSelectedFood(null);
              setSelectedMood(null);
              setSelectedHood(null);
              onSelectFoodTag?.('All');
              onSelectMoodTag?.('All');
              onSelectHoodTag?.('All');
            }}
            className={cn(
              'rounded-none border-2 bg-background text-foreground',
              'hover:bg-background hover:text-foreground',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapFiltersOverlay;
