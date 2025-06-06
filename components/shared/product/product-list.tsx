import {Product} from "@/types";
import ProductCard from "./product-card";

interface ProductListProps {
  data: Product[];
  title?: string;
  limit?: number;
}

const ProductList = ({data, title, limit}: ProductListProps) => {
  const dataLimit = limit ? data.slice(0, limit) : data; // display products based on limit

  return (
    <div className='my-10'>
      <h2 className='h2-bold mb-6'>{title}</h2>
      {data.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {dataLimit.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found🥺</p>
      )}
    </div>
  );
};

export default ProductList;
