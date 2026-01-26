import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { bakeries } from '@/data/bakeries';
import { X } from 'lucide-react';

function uniqueSorted(values: Iterable<string>): string[] {
  return Array.from(new Set(Array.from(values).map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
}

type MapFiltersOverlayProps = {
  className?: string;
  initialFoodTags?: string[];
  initialMoodTags?: string[];
  initialHoodTags?: string[];
  onSelectFoodTag?: (tags: string[]) => void;
  onSelectMoodTag?: (tags: string[]) => void;
  onSelectHoodTag?: (tags: string[]) => void;
};

type FilterVariant = 'food' | 'mood' | 'hood';

function TagDropdown({
  label,
  tags,
  onToggle,
  onClear,
  selectedTags,
  variant,
}: {
  label: string;
  tags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  selectedTags: Set<string>;
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

  const variantLabels: Record<FilterVariant, string> = {
    food: 'Filter by food type',
    mood: 'Filter by mood/atmosphere',
    hood: 'Filter by neighbourhood',
  };

  const getButtonAriaLabel = () => {
    const baseLabel = variantLabels[variant];
    if (selectedTags.size === 0) {
      return `${baseLabel}, no filters selected`;
    }
    const selectedList = Array.from(selectedTags).join(', ');
    return `${baseLabel}, ${selectedTags.size} selected: ${selectedList}`;
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
            selectedTags.size > 0 && 'bg-background text-foreground',
          )}
          aria-label={getButtonAriaLabel()}
        >
          <span className="tracking-wide" aria-hidden="true">{label}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="z-[2000] max-h-[50vh] w-56 overflow-auto bg-popover"
        role="listbox"
        aria-label={`${label} filter options`}
        aria-multiselectable="true"
      >
        {tags.length === 0 ? (
          <DropdownMenuItem disabled>(No tags)</DropdownMenuItem>
        ) : (
          <>
            {tags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onSelect={(e) => {
                  // Keep dropdown open on select; close only via trigger click or outside click.
                  e.preventDefault();
                  onToggle(tag);
                }}
                className={cn(
                  // Keep the pink highlight for selected items (no bold)
                  selectedTags.has(tag) && 'bg-accent text-accent-foreground',
                )}
                role="option"
                aria-selected={selectedTags.has(tag)}
              >
                {tag}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              key="__all__"
              onSelect={(e) => {
                e.preventDefault();
                onClear();
              }}
              role="option"
              aria-selected={selectedTags.size === 0}
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
  initialFoodTags,
  initialMoodTags,
  initialHoodTags,
  onSelectFoodTag,
  onSelectMoodTag,
  onSelectHoodTag,
}: MapFiltersOverlayProps) => {
  // Always derive options from the CSV-backed source of truth (`bakeries`).
  const foodTags = useMemo(() => uniqueSorted(bakeries.flatMap((b) => b.foodTags)), []);
  const moodTags = useMemo(() => uniqueSorted(bakeries.flatMap((b) => b.moodTags)), []);
  const hoodTags = useMemo(() => uniqueSorted(bakeries.map((b) => b.neighbourhood)), []);

  const [selectedFood, setSelectedFood] = useState<Set<string>>(() => new Set(initialFoodTags || []));
  const [selectedMood, setSelectedMood] = useState<Set<string>>(() => new Set(initialMoodTags || []));
  const [selectedHood, setSelectedHood] = useState<Set<string>>(() => new Set(initialHoodTags || []));

  const hasAnySelection =
    selectedFood.size > 0 || selectedMood.size > 0 || selectedHood.size > 0;

  const clearAll = () => {
    setSelectedFood(new Set());
    setSelectedMood(new Set());
    setSelectedHood(new Set());

    onSelectFoodTag?.([]);
    onSelectMoodTag?.([]);
    onSelectHoodTag?.([]);
  };

  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-0 z-[1500] pointer-events-none',
        className,
      )}
    >
      {/*
        IMPORTANT: Keep the full-width top overlay area non-interactive so it doesn't
        intercept clicks meant for Leaflet controls (e.g., the top-right zoom +).
        Only the actual filter controls are pointer-events enabled.
      */}
      <div className="pointer-events-none px-3 pt-3">
        <div className="pointer-events-auto w-fit max-w-full">
          <div className="flex flex-wrap items-center gap-2">
            <TagDropdown
              label="FOOD"
              tags={foodTags}
              variant="food"
              selectedTags={selectedFood}
              onClear={() => {
                setSelectedFood(new Set());
                onSelectFoodTag?.([]);
              }}
              onToggle={(tag) => {
                setSelectedFood((prev) => {
                  const next = new Set(prev);
                  if (next.has(tag)) next.delete(tag);
                  else next.add(tag);
                  onSelectFoodTag?.(Array.from(next));
                  return next;
                });
              }}
            />

            <TagDropdown
              label="MOOD"
              tags={moodTags}
              variant="mood"
              selectedTags={selectedMood}
              onClear={() => {
                setSelectedMood(new Set());
                onSelectMoodTag?.([]);
              }}
              onToggle={(tag) => {
                setSelectedMood((prev) => {
                  const next = new Set(prev);
                  if (next.has(tag)) next.delete(tag);
                  else next.add(tag);
                  onSelectMoodTag?.(Array.from(next));
                  return next;
                });
              }}
            />

            <TagDropdown
              label="HOOD"
              tags={hoodTags}
              variant="hood"
              selectedTags={selectedHood}
              onClear={() => {
                setSelectedHood(new Set());
                onSelectHoodTag?.([]);
              }}
              onToggle={(tag) => {
                setSelectedHood((prev) => {
                  const next = new Set(prev);
                  if (next.has(tag)) next.delete(tag);
                  else next.add(tag);
                  onSelectHoodTag?.(Array.from(next));
                  return next;
                });
              }}
            />

            {hasAnySelection && (
              <button
                type="button"
                onClick={clearAll}
                aria-label="Clear all filters"
                className={cn(
                  // bigger hit area, but visually just the X
                  'grid h-9 w-9 place-items-center rounded-none text-foreground/80',
                  'transition-colors hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  // Pull it slightly left so it tucks closer to the buttons
                  '-ml-1',
                )}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFiltersOverlay;
