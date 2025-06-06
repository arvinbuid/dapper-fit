"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from "../validators";
import {auth, signIn, signOut} from "@/auth";
import {hash} from "@/lib/encrypt";
import {isRedirectError} from "next/dist/client/components/redirect";
import {prisma} from "@/db/prisma";
import {formatError} from "../utils";
import {ShippingAddress} from "@/types";
import {z} from "zod";
import {PAGE_SIZE} from "../constants";
import {revalidatePath} from "next/cache";
import {Prisma} from "@prisma/client";
import {getUserCart} from "./cart.actions";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return {success: true, message: "Signed in successfully."};
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {success: false, message: "Invalid email or password."};
  }
}

// Sign out user
export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user
  const currentCart = await getUserCart();

  if (currentCart?.id) {
    await prisma.cart.delete({where: {id: currentCart.id}});
  } else {
    console.warn("No cart found for deletion.");
  }
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    // Validation against signUpFormSchema, will throw an error if unsuccessful
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    // Hash the password
    user.password = await hash(user.password);

    // Create user if hash is successful
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    // Sign in user after sign up
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return {success: true, message: "User signed up successfully."};
  } catch (error) {
    // console.log(error.name);
    // console.log(error.code);
    // console.log(error.errors);
    // console.log(error.meta?.target);
    if (isRedirectError(error)) {
      throw error;
    }

    return {success: false, message: formatError(error)};
  }
}

// Get user by id
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {id: userId},
  });

  if (!user) throw new Error("User not found.");
  return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    // Get user session
    const session = await auth();

    // Get current user
    const currentUser = await prisma.user.findFirst({
      where: {id: session?.user?.id},
    });

    if (!currentUser) throw new Error("User not found.");

    // Validate address
    const address = shippingAddressSchema.parse(data);

    // Update the database
    await prisma.user.update({
      where: {id: currentUser.id},
      data: {address},
    });

    return {
      success: true,
      message: "User updated successfully.",
    };
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    // Get user session
    const session = await auth();

    // Get current user
    const currentUser = await prisma.user.findFirst({
      where: {id: session?.user?.id},
    });

    if (!currentUser) throw new Error("User not found.");

    // Validate payment method
    const paymentMethod = paymentMethodSchema.parse(data);

    // Update the database
    await prisma.user.update({
      where: {id: currentUser.id},
      data: {paymentMethod: paymentMethod.type},
    });

    return {
      success: true,
      message: "User updated successfully.",
    };
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}

// Update the user profile
export async function updateUserProfile(user: {name: string; email: string}) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {id: session?.user?.id},
    });

    if (!currentUser) throw new Error("User not found.");

    // Update user profile
    await prisma.user.update({
      where: {id: currentUser.id},
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully.",
    };
  } catch (error) {
    return {success: false, message: formatError(error)};
  }
}

// Get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  // Get session
  const session = await auth();

  if (session?.user?.role !== "admin") throw new Error("User not authorized!");

  // Filter user query
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Get users and pagination
  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: {createdAt: "desc"},
    take: limit,
    skip: (page - 1) * limit,
  });

  // Get the users count
  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete user
export async function deleteUser(id: string) {
  try {
    // Get user from the database
    const user = await prisma.user.findFirst({
      where: {id},
    });

    if (!user) throw new Error("User not found.");

    // Delete user from the database
    await prisma.user.delete({
      where: {id},
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    // Get session
    const session = await auth();

    if (session?.user?.role !== "admin") throw new Error("Unauthorized access!");

    // Update user
    await prisma.user.update({
      where: {id: user.id},
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
