import { useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { Bakery } from '@/data/bakeries';
import { bakeries as allBakeries } from '@/data/bakeries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { foodTagDefinitions, moodTagDefinitions } from '@/data/tagDefinitions';
type SortColumn = 'name' | 'neighbourhood';
type SortDirection = 'asc' | 'desc';

type BakeryTableProps = {
  onSelectBakery?: (name: string) => void;
  bakeries?: Bakery[];
};

const BakeryTable = ({ onSelectBakery, bakeries = allBakeries }: BakeryTableProps) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('neighbourhood');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedBakeries = useMemo(() => {
    return [...bakeries].sort((a, b) => {
      const aValue = a[sortColumn].toLowerCase();
      const bValue = b[sortColumn].toLowerCase();
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [bakeries, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const getAriaSort = (column: SortColumn): 'ascending' | 'descending' | 'none' => {
    if (sortColumn !== column) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const handleKeyDown = (e: React.KeyboardEvent, column: SortColumn) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(column);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="pl-0 cursor-pointer hover:text-foreground select-none"
            onClick={() => handleSort('name')}
            onKeyDown={(e) => handleKeyDown(e, 'name')}
            tabIndex={0}
            role="columnheader"
            aria-sort={getAriaSort('name')}
            aria-label={`Sort by name, currently ${getAriaSort('name') === 'none' ? 'not sorted' : `sorted ${getAriaSort('name')}`}`}
          >
            Name{getSortIndicator('name')}
          </TableHead>
          <TableHead>
            <span className="inline-flex items-center gap-1">
              Food
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Food tag definitions"
                      className="inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                    >
                      <HelpCircle size={12} className="text-muted-foreground" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs text-left">
                    <ul className="space-y-1.5 text-xs">
                      {Object.entries(foodTagDefinitions).map(([tag, def]) => (
                        <li key={tag}><strong>{tag}:</strong> {def}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </TableHead>
          <TableHead>
            <span className="inline-flex items-center gap-1">
              Mood
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Mood tag definitions"
                      className="inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                    >
                      <HelpCircle size={12} className="text-muted-foreground" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs text-left">
                    <ul className="space-y-1.5 text-xs">
                      {Object.entries(moodTagDefinitions).map(([tag, def]) => (
                        <li key={tag}><strong>{tag}:</strong> {def}</li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:text-foreground select-none"
            onClick={() => handleSort('neighbourhood')}
            onKeyDown={(e) => handleKeyDown(e, 'neighbourhood')}
            tabIndex={0}
            role="columnheader"
            aria-sort={getAriaSort('neighbourhood')}
            aria-label={`Sort by neighbourhood, currently ${getAriaSort('neighbourhood') === 'none' ? 'not sorted' : `sorted ${getAriaSort('neighbourhood')}`}`}
          >
            Neighbourhood{getSortIndicator('neighbourhood')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedBakeries.map((bakery, index) => (
          <TableRow key={index} className={bakery.temporarilyClosed ? 'text-muted-foreground' : undefined}>
            <TableCell className="pl-0 text-left">
              {onSelectBakery ? (
                <button
                  type="button"
                  onClick={() => onSelectBakery(bakery.name)}
                  className={
                    bakery.temporarilyClosed
                      ? 'font-medium text-muted-foreground hover:text-muted-foreground text-left'
                      : 'font-medium text-primary hover:text-accent text-left'
                  }
                >
                  {bakery.name}
                  {bakery.temporarilyClosed ? ' (Temporarily Closed)' : ''}
                </button>
              ) : (
                <a
                  href={bakery.website || bakery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    bakery.temporarilyClosed
                      ? 'font-medium text-muted-foreground hover:text-muted-foreground text-left'
                      : 'font-medium text-left'
                  }
                >
                  {bakery.name}
                  {bakery.temporarilyClosed ? ' (Temporarily Closed)' : ''}
                </a>
              )}
            </TableCell>
            <TableCell>{bakery.foodTags.join(', ')}</TableCell>
            <TableCell>{bakery.moodTags.join(', ')}</TableCell>
            <TableCell>{bakery.neighbourhood}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BakeryTable;
