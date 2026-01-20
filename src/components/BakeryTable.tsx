import { bakeries } from '@/data/bakeries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const BakeryTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Neighbourhood</TableHead>
          <TableHead className="text-right">Rating</TableHead>
          <TableHead className="text-right">Reviews</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bakeries.map((bakery, index) => (
          <TableRow key={index}>
            <TableCell>
              <a 
                href={bakery.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium"
              >
                {bakery.name}
              </a>
            </TableCell>
            <TableCell>{bakery.neighbourhood}</TableCell>
            <TableCell className="text-right">
              {bakery.rating ? `${bakery.rating}★` : '–'}
            </TableCell>
            <TableCell className="text-right">
              {bakery.reviewsCount ? bakery.reviewsCount.toLocaleString() : '–'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BakeryTable;
