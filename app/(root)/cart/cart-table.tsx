"use client";

import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {useTransition} from "react";
import {AddItemToCart, removeItemFromCart} from "@/lib/actions/cart.actions";
import {ArrowRight, Plus, Minus, Loader, ShoppingCart} from "lucide-react";
import {Cart} from "@/types";
import Link from "next/link";
import Image from "next/image";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {formatCurrency} from "@/lib/utils";

const CartTable = ({cart}: {cart?: Cart}) => {
  const router = useRouter();
  const {toast} = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className='py-4 h2-bold'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className='mt-2'>
          Cart is empty. <Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-5 gap-5 mt-3'>
          <div className='overflow-x-auto md:col-span-4'>
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
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Link href={`/product/${item.slug}`} className='flex items-center'>
                        <Image src={item.image} alt={item.name} width={50} height={50} />
                        <span className='px-2'>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-center gap-3'>
                        <Button
                          disabled={isPending}
                          type='button'
                          variant='outline'
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromCart(item.productId);

                              if (!res.success) {
                                toast({
                                  variant: "destructive",
                                  description: res.message,
                                });
                              }
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className='w-4 h-4 animate-spin' />
                          ) : (
                            <Minus className='w-4 h-4' />
                          )}
                        </Button>
                        <span>{item.qty}</span>
                        <Button
                          disabled={isPending}
                          type='button'
                          variant='outline'
                          onClick={() => {
                            startTransition(async () => {
                              const res = await AddItemToCart(item);

                              if (!res.success) {
                                toast({
                                  variant: "destructive",
                                  description: res.message,
                                });
                              }
                            });
                          }}
                        >
                          {isPending ? (
                            <Loader className='w-4 h-4 animate-spin' />
                          ) : (
                            <Plus className='w-4 h-4' />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className='p-3 gap-4'>
              <div className='pb-3 text-md'>
                Subtotal ({cart.items.reduce((acc, cur) => acc + cur.qty, 0)}): {""}
                <span className='font-bold'>{formatCurrency(cart.itemsPrice)}</span>
              </div>
              <Button
                className='w-full'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => {
                    router.push("/shipping-address");
                  })
                }
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}
                Proceed to checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
