"use client";

import {useToast} from "@/hooks/use-toast";
import {productDefaultValue} from "@/lib/constants";
import {insertProductSchema} from "@/lib/validators";
import {Product} from "@/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {ControllerRenderProps, SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "../ui/form";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";
import slugify from "slugify";
import {createProduct, updateProduct} from "@/lib/actions/product.actions";

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

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (values) => {
    // On Create
    if (type === "Create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          variant: "default",
          description: res.message,
        });

        router.push("/admin/products");
      }
    }

    // On Update
    if (type === "Update") {
      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({...values, id: productId});

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          variant: "default",
          description: res.message,
        });

        router.push("/admin/products");
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form method='POST' onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex flex-col md:flex-row gap-5'>
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({
                field,
              }: {
                field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "name">;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter product name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Slug */}
            <FormField
              control={form.control}
              name='slug'
              render={({
                field,
              }: {
                field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "slug">;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Name</FormLabel>
                  <div className='relative'></div>
                  <FormControl>
                    <Input placeholder='Enter slug' {...field} />
                  </FormControl>
                  <Button
                    type='button'
                    className='text-white bg-gray-500 hover:bg-gray-600 mt-2'
                    onClick={() =>
                      form.setValue("slug", slugify(form.getValues("name"), {lower: true}))
                    }
                  >
                    Generate
                  </Button>
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-5'>
            {/* Category */}
            <FormField
              control={form.control}
              name='category'
              render={({
                field,
              }: {
                field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "category">;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Category</FormLabel>
                  <div className='relative'></div>
                  <FormControl>
                    <Input placeholder='Enter category' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Brand */}
            <FormField
              control={form.control}
              name='brand'
              render={({
                field,
              }: {
                field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "brand">;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Brand</FormLabel>
                  <div className='relative'></div>
                  <FormControl>
                    <Input placeholder='Enter product brand' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-5'>
            {/* Price */}
            <FormField
              control={form.control}
              name='price'
              render={({
                field,
              }: {
                field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "price">;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Price</FormLabel>
                  <div className='relative'></div>
                  <FormControl>
                    <Input placeholder='Enter price' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Stock */}
            <FormField
              control={form.control}
              name='stock'
              render={({
                field,
              }: {
                field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "stock">;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Stock</FormLabel>
                  <div className='relative'></div>
                  <FormControl>
                    <Input placeholder='Enter stock' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='upload-field flex md:flex-row gap-5'>{/* Images */}</div>
          <div className='upload-field'>{/* isFeatured */}</div>
          <div>
            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({
                field,
              }: {
                field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "description">;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Description</FormLabel>
                  <div className='relative'></div>
                  <FormControl>
                    <Textarea
                      placeholder='Type the description here...'
                      {...field}
                      className='resize-none'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            {/* Submit */}
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='button col-span-2 w-full'
            >
              {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AdminProductForm;
