// Reference: https://next-auth.js.org/getting-started/typescript#module-augmentation
import {DefaultSession} from "next-auth";

declare module "next-auth" {
  export interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}
