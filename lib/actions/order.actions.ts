"use server";

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {formatError} from "../utils";
import {auth} from "@/auth";
import {getUserById} from "./user.actions";
import {getUserCart} from "./cart.actions";
import {insertOrderSchema} from "../validators";
import {prisma} from "@/db/prisma";
import {CartItem} from "@/types";

// Create order and create order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated.");

    // Get cart
    const cart = await getUserCart();
    if (!cart) throw new Error("Cart not found.");

    // Get user session
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found.");

    const user = await getUserById(userId);

    // Check if cart is empty, user have no address, and user have no payment method
    if (!cart || cart.items.length === 0) {
      return {success: false, message: "Your cart is empty", redirectTo: "/cart"};
    }
    if (!user.address) {
      return {success: false, message: "No shipping address", redirectTo: "/shipping-address"};
    }
    if (!user.paymentMethod) {
      return {success: false, message: "No payment method", redirectTo: "/payment-method"};
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      totalPrice: cart.totalPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
    });

    // Create a transaction to create order and order items into the database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = tx.order.create({
        data: order,
      });

      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: (await insertedOrder).id,
          },
        });
      }

      // Clear cart
      await tx.cart.update({
        where: {id: cart.id},
        data: {
          items: [],
          totalPrice: 0,
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
        },
      });

      return (await insertedOrder).id;
    });

    if (!insertedOrderId) throw new Error("Order not created.");

    return {success: true, message: "Order created", redirectTo: `order/${insertedOrderId}`};
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {success: false, message: formatError(error)};
  }
}
