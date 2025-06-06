"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import ReviewForm from "./review-form";
import {getReviews} from "@/lib/actions/review.actions";
import {Review} from "@/types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar, User} from "lucide-react";
import {formatDateTime} from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({productId});
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  // Reload reviews after getting created or updated
  const reload = async () => {
    const res = await getReviews({productId});
    setReviews([...res.data]);
  };

  return (
    <>
      <div className='space-y-3'>
        {reviews.length === 0 && <p className='my-3'>No reviews found.</p>}
        {userId ? (
          <>
            <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
          </>
        ) : (
          <div className='mt-3 mb-5'>
            Please{" "}
            <Link href={`/sign-in?callbackUrl=/product/${productSlug}`} className='text-blue-700'>
              sign in
            </Link>{" "}
            to continue
          </div>
        )}
        <div className='flex flex-col gap-3'>
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className='flex-between'>
                <CardHeader>
                  <CardTitle>{review.title}</CardTitle>
                  <CardDescription>{review.description}</CardDescription>
                </CardHeader>
              </div>
              <CardContent>
                <div className='flex space-x-4 text-sm text-muted-foreground'>
                  <Rating value={review.rating} />
                  <div className='flex items-center'>
                    <User className='mr-1 h-3 w-3' />
                    {review.user ? review.user.name : "User"}
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='mr-1 h-3 w-3' />
                    {formatDateTime(review.createdAt).dateTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewList;
