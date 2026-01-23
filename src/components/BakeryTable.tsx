import { useMemo, useState } from 'react';
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="pl-0 cursor-pointer hover:text-foreground select-none"
            onClick={() => handleSort('name')}
          >
            Name{getSortIndicator('name')}
          </TableHead>
          <TableHead>
            Food
          </TableHead>
          <TableHead>
            Mood
          </TableHead>
          <TableHead
            className="cursor-pointer hover:text-foreground select-none"
            onClick={() => handleSort('neighbourhood')}
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
