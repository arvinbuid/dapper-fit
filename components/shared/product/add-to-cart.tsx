"use client";

import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {ToastAction} from "@/components/ui/toast";
import {Minus, Plus, Loader} from "lucide-react";
import {AddItemToCart, removeItemFromCart} from "@/lib/actions/cart.actions";
import {Cart, CartItem} from "@/types";
import {useTransition} from "react";

const AddToCart = ({cart, item}: {cart?: Cart; item: CartItem}) => {
  const router = useRouter();
  const {toast} = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await AddItemToCart(item);

      if (!res.success) {
        toast({
          variant: "destructive",
          title: res.message,
        });
        return;
      }

      // Handle success add to cart
      toast({
        title: res.message,
        description: "Go to your cart to checkout your order.",
        action: (
          <ToastAction
            className='bg-primary hover:bg-gray-800 hover:text-white'
            altText='Go to Cart'
            onClick={() => router.push("/cart")}
          >
            Go to Cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      return;
    });
  };

  const existItem = cart && cart.items.find((c) => c.productId === item.productId);

  return existItem ? (
    <div className='flex flex-center gap-3'>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        {isPending ? <Loader className='w-4 h-4 animate-spin' /> : <Minus className='w-4 h-4' />}
      </Button>
      <span>{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        {isPending ? <Loader className='w-4 h-4 animate-spin' /> : <Plus className='w-4 h-4' />}
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' variant='default' onClick={handleAddToCart}>
      {isPending ? <Loader className='w-4 h-4 animate-spin' /> : <Plus className='w-4 h-4' />}
      Add to Cart
    </Button>
  );
};

export default AddToCart;
