import { ChevronDown } from 'lucide-react';

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
}: {
  label: string;
  tags: string[];
  onSelect?: (tag: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70"
        >
          <span className="tracking-wide">{label}</span>
          <ChevronDown className="opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="z-[2000] max-h-[50vh] w-56 overflow-auto bg-popover"
      >
        {tags.length === 0 ? (
          <DropdownMenuItem disabled>(No tags)</DropdownMenuItem>
        ) : (
          tags.map((tag) => (
            <DropdownMenuItem
              key={tag}
              onSelect={() => {
                onSelect?.(tag);
              }}
            >
              {tag}
            </DropdownMenuItem>
          ))
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
  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-0 z-[1500] pointer-events-none',
        className,
      )}
    >
      <div className="pointer-events-auto px-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <TagDropdown label="FOOD" tags={foodTags} onSelect={onSelectFoodTag} />
          <TagDropdown label="MOOD" tags={moodTags} onSelect={onSelectMoodTag} />
          <TagDropdown label="HOOD" tags={hoodTags} onSelect={onSelectHoodTag} />
        </div>
      </div>
    </div>
  );
};

export default MapFiltersOverlay;
