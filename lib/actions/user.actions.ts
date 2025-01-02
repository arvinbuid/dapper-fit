"use server";

import {signInFormSchema, signUpFormSchema} from "../validators";
import {signIn, signOut} from "@/auth";
import {hashSync} from "bcrypt-ts-edge";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {prisma} from "@/db/prisma";

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
      password: user.password,
    });

    return {success: true, message: "User signed up successfully."};
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {success: false, message: "User cannot be created."};
  }
}
