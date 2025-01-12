"use client";

import {useToast} from "@/hooks/use-toast";
import {productDefaultValue} from "@/lib/constants";
import {insertProductSchema, updateProductSchema} from "@/lib/validators";
import {Product} from "@/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {ControllerRenderProps, SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";
import slugify from "slugify";
import {createProduct, updateProduct} from "@/lib/actions/product.actions";
import {UploadButton} from "@/lib/uploadthing";
import {Card, CardContent} from "../ui/card";
import Image from "next/image";

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
    resolver:
      type === "Update" ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema),
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

  const images = form.watch("images");

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
                  <FormMessage />
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
                  <FormLabel>Slug</FormLabel>
                  <div className='relative'></div>
                  <FormControl>
                    <Input placeholder='Enter slug' {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='upload-field flex md:flex-row gap-5'>
            {/* Images */}
            <FormField
              control={form.control}
              name='images'
              render={() => (
                <FormItem className='w-full'>
                  <FormLabel>Images</FormLabel>
                  <Card>
                    <CardContent className='space-y-2 mt-2 min-h-48'>
                      <div className='flex-start space-x-2'>
                        {images.map((image: string) => (
                          <Image
                            key={image}
                            src={image}
                            alt='product image'
                            className='w-20 h-20 object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                            unoptimized
                          />
                        ))}
                        <FormControl>
                          <UploadButton
                            endpoint='imageUploader'
                            onClientUploadComplete={(res: {url: string}[]) => {
                              form.setValue("images", [...images, res[0].url]);
                            }}
                            onUploadError={(error: Error) => {
                              toast({
                                variant: "destructive",
                                description: `ERROR! ${error.message}`,
                              });
                            }}
                          />
                        </FormControl>
                      </div>
                    </CardContent>
                  </Card>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  <FormMessage />
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
