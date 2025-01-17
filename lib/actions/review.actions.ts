"use server";

import {z} from "zod";
import {insertReviewSchema} from "../validators";
import {formatError} from "../utils";
import {auth} from "@/auth";
import {prisma} from "@/db/prisma";
import {revalidatePath} from "next/cache";

// Create and Update Reviews
export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
  try {
    // Get user session
    const session = await auth();
    if (!session) throw new Error("User not authenticated.");

    // Validate and store review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: {id: review.productId},
    });

    if (!product) throw new Error("Product not found.");

    // Check if user already reviewed
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    // Do transaction to update or create review
    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        // Update review
        await tx.review.update({
          where: {id: reviewExists.id},
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        // Create review
        await tx.review.create({
          data: review,
        });
      }

      // Get average rating
      const avgRating = await tx.review.aggregate({
        _avg: {rating: true},
        where: {productId: review.productId},
      });

      // Get number of reviews
      const numReviews = await tx.review.count({
        where: {productId: review.productId},
      });

      // Update the rating and number of reviews in the table
      await tx.product.update({
        where: {id: review.productId},
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    // Revalidate path
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get All Reviews for a product
export async function getReviews({productId}: {productId: string}) {
  const data = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {name: true},
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {data};
}

// Get a review written by current user
export async function getReviewByProductId({productId}: {productId: string}) {
  const session = await auth();

  if (!session) throw new Error("User not authenticated!");

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session?.user?.id,
    },
  });
}
