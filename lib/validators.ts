import {z} from "zod";
import {formatNumberWithDecimal} from "./utils";
import {PAYMENT_METHODS} from "./constants";

// Schema for prices to display exactly two decimal places
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places."
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters."),
  slug: z.string().min(3, "Slug must be atleast 3 characters."),
  category: z.string().min(3, "Category must be atleast 3 characters."),
  brand: z.string().min(3, "Brand must be atleast 3 characters."),
  description: z.string().min(3, "Description must be atleast 3 characters."),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have atleast one image."),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Product id is required"),
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be atleast 6 characters long."),
});

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be atleast 3 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be atleast 6 characters long."),
    confirmPassword: z.string().min(6, "Password must be atleast 6 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

// Cart Schemas
export const cartItemSchema = z.object({
  // productId, name, slug, qty, image, price
  productId: z.string().min(1, "Product is required."),
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required."),
  qty: z.number().int().nonnegative("Quantity must be positive number."),
  image: z.string().min(1, "Image is required."),
  price: currency,
});

export const insertCartSchema = z.object({
  // items, itemsPrice, totalPrice, shippingPrice, taxPrice, sessionCartId, userId - optional & nullable
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required."),
  userId: z.string().optional().nullable(), // Nullable so that user can add items to cart even if it is not logged in
});

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  // fullName, streetAddress, city, postalCode, country, lat - optional, lng - optional
  fullName: z.string().min(3, "Name should be atleast 3 characters long."),
  streetAddress: z.string().min(10, "Shipping address should be atleast 10 characters long."),
  city: z.string().min(3, "City should be atleast 3 characters long."),
  postalCode: z.string().min(3, "Postal code should be atleast 3 characters long."),
  country: z.string().min(3, "Country should be atleast 3 characters long."),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Payment Method Schema
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required."),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

// Inserting Order Schema
export const insertOrderSchema = z.object({
  // userId, itemsPrice, shippingPrice, taxPrice, totalPrice, paymentMethod, shippingAddress
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid Payment Method",
  }),
  shippingAddress: shippingAddressSchema,
});

// Inserting Order Item Schema
export const insertOrderItemSchema = z.object({
  // productId, qty, name, slug, image, price
  productId: z.string(),
  qty: z.number(),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  price: currency,
});

// Paypal Payment Result Schema
export const paymentResultSchema = z.object({
  // id, status, email_address, pricePaid
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Updating User Profile Schema
export const updateUserProfileSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters long."),
  email: z
    .string()
    .email("Invalid email format.")
    .min(3, "Email must be atleast 5 characters long."),
});

// Update User Schema
export const updateUserSchema = updateUserProfileSchema.extend({
  id: z.string().min(1, "Id is required."),
  role: z.string().min(4, "Role is required."),
});

// Insert Review Schema
export const insertReviewSchema = z.object({
  // id, userId, productId, rating, title, description, isVerifiedPurchase, createdAt
  userId: z.string().min(1, "User is required."),
  productId: z.string().min(1, "Product is required."),
  title: z.string().min(3, "Title must be atleast 3 characters long."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be atleast 1.")
    .max(5, "Rating must be atmost 5."),
  description: z.string().min(3, "Description must be atleast 3 characters long."),
});
