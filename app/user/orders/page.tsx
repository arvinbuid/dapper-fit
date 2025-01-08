import {Metadata} from "next";
import {getMyOrders} from "@/lib/actions/order.actions";
import {formatCurrency, formatId, formatDateTime} from "@/lib/utils";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "My Orders",
};

const OrdersPage = async (props: {searchParams: Promise<{page: string}>}) => {
  const {page} = await props.searchParams;

  // Get orders
  const orders = await getMyOrders({
    page: Number(page) || 1,
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
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                    <Badge variant='outline'>Details</Badge>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersPage;
