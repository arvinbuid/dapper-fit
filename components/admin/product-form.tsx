"use client";

import {useToast} from "@/hooks/use-toast";
import {productDefaultValue} from "@/lib/constants";
import {insertProductSchema} from "@/lib/validators";
import {Product} from "@/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form} from "../ui/form";

const AdminProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product && type === "Update" ? product : productDefaultValue,
  });

  const onSubmit = () => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Name */}
          {/* Slug */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Category */}
          {/* Brand */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Price */}
          {/* Stock */}
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>{/* Images */}</div>
        <div className='upload-field'>{/* isFeatured */}</div>
        <div>{/* Description */}</div>
        <div>{/* Submit */}</div>
      </form>
    </Form>
  );
};

export default AdminProductForm;
