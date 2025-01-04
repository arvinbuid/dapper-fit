export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Dapper Fit";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce project application built using Next.js.";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValue = {
  email: "",
  password: "",
};

export const signUpDefaultValue = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValue = {
  // fullName, streetAddress, city, postalCode, country
  fullName: "John Doe",
  streetAddress: "123 Example Street",
  city: "Anytown",
  postalCode: "1234",
  country: "Philippines",
};
