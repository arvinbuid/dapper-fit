import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";

import ProductPrice from "@/components/shared/product/product-price";
import {getProductBySlug} from "@/lib/actions/product.actions";
import {notFound} from "next/navigation";
import ProductImages from "@/components/shared/product/product-image";
import AddToCart from "@/components/shared/product/add-to-cart";
import {getUserCart} from "@/lib/actions/cart.actions";

const ProductDetailsPage = async (props: {params: Promise<{slug: string}>}) => {
  const {slug} = await props.params;

  const cart = await getUserCart();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          {/* Images Column */}
          <div className='col-span-2'>
            <ProductImages images={product.images} />
          </div>
          {/* Details Column */}
          <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-6'>
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className='h3-bold'>{product.name}</h1>
              <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                <ProductPrice
                  value={Number(product.price)}
                  className='w-28 bg-green-100 text-green-700 px-4 py-2 rounded-full'
                />
              </div>
              <div className='mt-10'>
                <p className='font-semibold'>Product Description</p>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent className='p-4'>
                <div className='mb-2 flex justify-between'>
                  <p>Price</p>
                  <ProductPrice value={Number(product.price)} />
                </div>
                <div className='mb-3 flex justify-between'>
                  <p>Stock</p>
                  {product.stock > 0 ? (
                    <Badge variant='outline'>In Stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Out of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <AddToCart
                    cart={cart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      slug: product.slug,
                      qty: 1,
                      image: product!.images[0],
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
