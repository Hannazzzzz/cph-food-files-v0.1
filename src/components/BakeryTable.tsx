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
          <TableHead className="pl-0">Bakery</TableHead>
          <TableHead>Neighbourhood</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bakeries.map((bakery, index) => (
          <TableRow key={index}>
            <TableCell className="pl-0">
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BakeryTable;
