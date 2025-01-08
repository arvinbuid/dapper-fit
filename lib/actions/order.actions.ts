"use server";

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {convertToPlainObject, formatError} from "../utils";
import {auth} from "@/auth";
import {getUserById} from "./user.actions";
import {getUserCart} from "./cart.actions";
import {insertOrderSchema} from "../validators";
import {prisma} from "@/db/prisma";
import {CartItem, PaymentResult} from "@/types";
import {paypal} from "../paypal";
import {revalidatePath} from "next/cache";

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

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {id: orderId},
    include: {
      orderitems: true,
      user: {select: {name: true, email: true}}, // select user but only the name and email
    },
  });

  return convertToPlainObject(data);
}

// Create a new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {id: orderId},
    });

    if (order) {
      // Create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update order with paypal order id
      await prisma.order.update({
        where: {id: paypalOrder.id},
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found.");
    }
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}
