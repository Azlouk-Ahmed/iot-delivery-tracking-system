// ordersColumns.tsx
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Order = {
  id: string;
  email: string;
  user: string;
  company: string;
  vehicleId: string;
  status: "pending" | "in-progress" | "delivered" | "cancelled" | "failed";
  products: { product: string; qty: number; price: number; _id?: string }[];
  date: string;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, any> = {
    delivered: "default",
    pending: "secondary",
    "in-progress": "outline",
    cancelled: "destructive",
    failed: "destructive",
  };
  return (
    <Badge variant={variants[status] || "secondary"} className="capitalize">
      {status.replace("-", " ")}
    </Badge>
  );
};

// Helper: Map product code → readable name (optional, customize as needed)
const productNameMap: Record<string, string> = {
  p1: "Product A",
  p2: "Product B",
  p3: "Product C",
  p4: "Product D",
};

export const ordersColumns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id").slice(-6)}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "vehicleId",
    header: "Vehicle",
  },
  {
    accessorKey: "products",
    header: () => <div className="text-center">Products</div>,
    cell: ({ row }) => {
      const products = row.getValue("products") as Order["products"];
      
      if (!products || products.length === 0) {
        return <span className="text-muted-foreground">No products</span>;
      }

      return (
        <div className="text-left text-xs space-y-1 max-w-[200px]">
          {products.map((item, idx) => {
            const name = productNameMap[item.product] || item.product;
            return (
              <div key={idx} className="flex justify-between">
                <span className="font-medium">{name}</span>
                <span className="text-muted-foreground">
                  ×{item.qty} @ ${item.price.toFixed(2)}
                </span>
              </div>
            );
          })}
          {/* Optional total */}
          {products.length > 1 && (
            <div className="border-t pt-1 font-semibold">
              Total: ${products.reduce((sum, p) => sum + p.price * p.qty, 0).toFixed(2)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div>{new Date(date).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Order</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];