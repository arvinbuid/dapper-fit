"use server";

import {shippingAddressSchema, signInFormSchema, signUpFormSchema} from "../validators";
import {auth, signIn, signOut} from "@/auth";
import {hashSync} from "bcrypt-ts-edge";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {prisma} from "@/db/prisma";
import {formatError} from "../utils";
import {ShippingAddress} from "@/types";

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
    user.password = hashSync(user.password, 12);

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

    if (!currentUser) throw new Error("User cannot be found.");

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
