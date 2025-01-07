import {auth} from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getUserCart} from "@/lib/actions/cart.actions";
import {getUserById} from "@/lib/actions/user.actions";
import {formatCurrency} from "@/lib/utils";
import {ShippingAddress} from "@/types";
import {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async () => {
  const cart = await getUserCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect("/cart");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className='pb-4 text-2xl'>Place Order</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          {/* Shipping Address */}
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}, {userAddress.postalCode}{" "}
                {userAddress.country}{" "}
              </p>
              <div className='mt-4'>
                <Button variant='outline'>
                  <Link href='/shipping-address'>Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Payment Method */}
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <div className='mt-4'>
                <Button variant='outline'>
                  <Link href='/payment-method'>Edit</Link>
                </Button>
              </div>
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
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className='flex items-center'>
                          <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className='text-center'>{item.qty}</TableCell>
                      <TableCell className='text-right'>₱{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex-between'>
                <p>Items: </p>
                <p>{formatCurrency(cart.itemsPrice)}</p>
              </div>
              <div className='flex-between'>
                <p>Tax: </p>
                <p>{formatCurrency(cart.taxPrice)}</p>
              </div>
              <div className='flex-between'>
                <p>Shipping: </p>
                <p>{formatCurrency(cart.shippingPrice)}</p>
              </div>
              <div className='flex-between'>
                <p>Total: </p>
                <p>{formatCurrency(cart.totalPrice)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
