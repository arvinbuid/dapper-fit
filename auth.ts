import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "@/lib/encrypt";
import {cookies} from "next/headers";
import {authConfig} from "./auth.config";

const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {type: "email"},
        password: {type: "password"},
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        // Find user in the database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(credentials.password as string, user.password);

          // If user & password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user does not exist or password does not match, return null
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({session, user, trigger, token}: any) {
      // Set the user ID from the token
      session.user.id = token.sub; // token subject
      session.user.role = token.role; // assign role to token
      session.user.name = token.name; // assign name to token

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({token, user, trigger, session}: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0]; // If user have no name, take the first index (name) in the user email.

          await prisma.user.update({
            where: {id: user.id},
            data: {name: token.name},
          });
        }

        // Persist session cart
        if (trigger === "signIn" || trigger === "signUp") {
          // Get cookie object, get sessionCartId
          const cookieObject = await cookies();
          const sessionCartId = cookieObject.get("sessionCartId")?.value;

          // If there is sessionCartId, get it from the db
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {sessionCartId},
            });

            if (sessionCart) {
              // delete current user cart
              await prisma.cart.deleteMany({
                where: {userId: user.id},
              });

              // Assign new cart
              await prisma.cart.update({
                where: {id: sessionCart.id},
                data: {userId: user.id},
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
  },
};

export const {handlers, auth, signIn, signOut} = NextAuth(config);
