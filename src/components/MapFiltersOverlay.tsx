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

type MapFiltersOverlayProps = {
  className?: string;
  onSelectFoodTag?: (tag: string) => void;
  onSelectMoodTag?: (tag: string) => void;
  onSelectHoodTag?: (tag: string) => void;
};

function TagDropdown({
  label,
  tags,
  onSelect,
  selected,
}: {
  label: string;
  tags: string[];
  onSelect?: (tag: string) => void;
  selected: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'rounded-full bg-accent text-accent-foreground border-2 border-transparent',
            'hover:ring-2 hover:ring-accent hover:ring-offset-2 hover:ring-offset-background',
            'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            selected && 'ring-2 ring-accent ring-offset-2 ring-offset-background',
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
            onSelect={(tag) => {
              if (tag === 'All') {
                setSelectedHood(null);
              } else {
                setSelectedHood(tag);
              }
              onSelectHoodTag?.(tag);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapFiltersOverlay;
