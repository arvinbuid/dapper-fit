import Link from "next/link";
import Image from "next/image";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Product} from "@/types";
import ProductPrice from "./product-price";

interface ProductProps {
  product: Product;
}

const ProductCard = ({product}: ProductProps) => {
  return (
    <Card className='w-full max-w-sm mx-auto'>
      <CardHeader className='p-0 items-center'>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            unoptimized
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className='p-4 grid gap-4'>
        <div className='text-xs'>{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className='text-sm font-medium'>{product.name}</h2>
        </Link>
        <div className='flex-between gap-4 text-sm'>
          <p>{product.rating} Stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className='text-destructive font-semibold'>Out of stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
