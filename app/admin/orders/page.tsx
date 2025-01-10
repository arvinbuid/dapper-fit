import {auth} from "@/auth";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {deleteOrder, getAllOrders} from "@/lib/actions/order.actions";
import {formatCurrency, formatDateTime, formatId} from "@/lib/utils";
import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin All Orders",
};

const AdminOrdersPage = async (props: {
  searchParams: Promise<{
    page: string;
  }>;
}) => {
  const {page = 1} = await props.searchParams;

  const session = await auth();

  if (session?.user?.role !== "admin") throw new Error("User not authorized!");

  // Get all orders
  const orders = await getAllOrders({
    page: Number(page),
  });

  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Orders</h2>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className='min-w-[180px]'>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead className='min-w-[180px]'>PAID</TableHead>
              <TableHead className='min-w-[150px]'>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    formatDateTime(order.paidAt).dateTime
                  ) : (
                    <Badge variant='destructive'>Not Paid</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    formatDateTime(order.deliveredAt).dateTime
                  ) : (
                    <Badge variant='destructive'>Not Delivered</Badge>
                  )}
                </TableCell>
                <TableCell className='flex items-center gap-2'>
                  <Button size='sm' asChild variant='outline'>
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
