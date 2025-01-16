"use client";

import {Product} from "@/types";
import Link from "next/link";
import {useState} from "react";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Product[]>([]);

  return (
    <>
      <div className='space-y-2'>
        {reviews.length === 0 && <p>No reviews found.</p>}
        {userId ? (
          <>{/*REVIEW FORM */}</>
        ) : (
          <div>
            Please{" "}
            <Link href={`/sign-in?callbackUrl=/product/${productSlug}`} className='text-blue-700'>
              sign in
            </Link>{" "}
            to continue
          </div>
        )}
        <div className='flex flex-col gap-3'>{/* REVIEWS */}</div>
      </div>
    </>
  );
};

export default ReviewList;
