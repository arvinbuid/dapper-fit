"use client";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatCurrency, formatDateTime, formatId} from "@/lib/utils";
import {Order} from "@/types";
import Link from "next/link";
import Image from "next/image";
import {PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {createPaypalOrder, approvePaypalOrder} from "@/lib/actions/order.actions";
import {toast} from "@/hooks/use-toast";

const OrderDetailsTable = ({order, paypalClientId}: {order: Order; paypalClientId: string}) => {
  const {
    id,
    shippingAddress,
    paymentMethod,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{isPending, isRejected}] = usePayPalScriptReducer();
    let status = "";

    if (isPending) {
      status = "Loading Paypal...";
    } else if (isRejected) {
      status = "Error Loading Paypal";
    }

    return status;
  };

  const handleCreatePaypalOrder = async () => {
    const res = await createPaypalOrder(order.id);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }

    return res.data;
  };

  const handleApprovePaypalOrder = async (data: {orderID: string}) => {
    const res = await approvePaypalOrder(order.id, data);

    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    });
  };

  return (
    <>
      <h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 overflow-y-auto space-y-4'>
          {/* Payment Method */}
          <Card>
            <CardContent>
              <h2 className='py-4 text-xl'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>Paid at {formatDateTime(paidAt!).dateTime}</Badge>
              ) : (
                <Badge variant='destructive'>Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          {/* Shipping Address */}
          <Card>
            <CardContent>
              <h2 className='py-4 text-xl'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className='mb-2'>
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {deliveredAt ? (
                <Badge variant='secondary'>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          {/* Order Items */}
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className='flex items-center'>
                          <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className='text-center'>{item.qty}</TableCell>
                      <TableCell className='text-right'>${item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Order Price List */}
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex-between'>
                <p>Items: </p>
                <p>{formatCurrency(itemsPrice)}</p>
              </div>
              <div className='flex-between'>
                <p>Tax: </p>
                <p>{formatCurrency(taxPrice)}</p>
              </div>
              <div className='flex-between'>
                <p>Shipping: </p>
                <p>{formatCurrency(shippingPrice)}</p>
              </div>
              <div className='flex-between'>
                <p>Total: </p>
                <p>{formatCurrency(totalPrice)}</p>
              </div>
              {/* Paypal Payment */}
              {!isPaid && paymentMethod === "Paypal" && (
                <div>
                  <PayPalScriptProvider options={{clientId: paypalClientId}}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePaypalOrder}
                      onApprove={handleApprovePaypalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
