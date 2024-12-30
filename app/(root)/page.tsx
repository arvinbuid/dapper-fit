import ProductList from "@/components/shared/products/product-list";
import sampleData from "@/db/sample-data";

const Homepage = async () => {
  return (
    <>
      <ProductList data={sampleData.products} title='Newest Arrivals' limit={4} />
    </>
  );
};

export default Homepage;
