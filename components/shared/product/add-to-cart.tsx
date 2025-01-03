"use client";

import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {ToastAction} from "@/components/ui/toast";
import {Plus} from "lucide-react";
import {AddItemToCart} from "@/lib/actions/cart.actions";
import {CartItem} from "@/types";

const AddToCart = ({item}: {item: CartItem}) => {
  const router = useRouter();
  const {toast} = useToast();

  const handleAddToCart = async () => {
    const res = await AddItemToCart(item);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
      return;
    }

    // Handle success add to cart
    toast({
      title: `${item.name} added to cart`,
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
  };
  return (
    <Button className='w-full' type='button' variant='default' onClick={handleAddToCart}>
      <Plus />
      Add to Cart
    </Button>
  );
};

export default AddToCart;
