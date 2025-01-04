import {auth} from "@/auth";
import {getUserCart} from "@/lib/actions/cart.actions";
import {getUserById} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import {Metadata} from "next";
import {ShippingAddress} from "@/types";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  // Get cart
  const cart = await getUserCart();

  // If no cart, redirect back to /cart
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  // Get user session
  const userId = session?.user?.id;

  if (!userId) throw new Error("No user ID!");

  const user = await getUserById(userId);

  return <>Shipping Address</>;
};

export default ShippingAddressPage;
