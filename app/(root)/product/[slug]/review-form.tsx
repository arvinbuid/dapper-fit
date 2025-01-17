"use client";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/hooks/use-toast";
import {createUpdateReview} from "@/lib/actions/review.actions";
import {reviewFormDefaultValues} from "@/lib/constants";
import {insertReviewSchema} from "@/lib/validators";
import {zodResolver} from "@hookform/resolvers/zod";
import {StarIcon} from "lucide-react";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const {toast} = useToast();

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  const handleFormOpen = () => {
    form.setValue("productId", productId);
    form.setValue("userId", userId);
    setOpen(true);
  };

  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
    const res = await createUpdateReview({
      ...values,
      productId,
    });

    if (!res.success) {
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }

    setOpen(false);

    onReviewSubmitted();

    return toast({
      description: res.message,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleFormOpen} variant='default' size='sm'>
        Write a review
      </Button>
      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>Share your thoughts with other customers</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              {/* Review Title */}
              <FormField
                control={form.control}
                name='title'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter title...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Review Description */}
              <FormField
                control={form.control}
                name='description'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter description...' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Review Rating */}
              <FormField
                control={form.control}
                name='rating'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select rating' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({length: 5}).map((_, index) => (
                          <SelectItem key={index} value={(index + 1).toString()}>
                            {index + 1} <StarIcon className='inline w-4 h-4 ml-1' />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type='submit'
                className='w-full'
                size='lg'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
