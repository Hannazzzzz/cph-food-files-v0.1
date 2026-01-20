import { useState, useMemo } from 'react';
import { bakeries } from '@/data/bakeries';
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
};

const BakeryTable = ({ onSelectBakery }: BakeryTableProps) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('neighbourhood');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedBakeries = useMemo(() => {
    return [...bakeries].sort((a, b) => {
      const aValue = a[sortColumn].toLowerCase();
      const bValue = b[sortColumn].toLowerCase();
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortColumn, sortDirection]);

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
            Bakery{getSortIndicator('name')}
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
          <TableRow key={index}>
            <TableCell className="pl-0 text-left">
              {onSelectBakery ? (
                <button
                  type="button"
                  onClick={() => onSelectBakery(bakery.name)}
                  className="font-medium text-primary hover:underline"
                >
                  {bakery.name}
                </button>
              ) : (
                <a
                  href={bakery.website || bakery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium"
                >
                  {bakery.name}
                </a>
              )}
            </TableCell>
            <TableCell>{bakery.neighbourhood}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BakeryTable;
