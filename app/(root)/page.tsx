import DealCountdown from "@/components/deal-countdown";
import IconBoxes from "@/components/icon-boxes";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/shared/view-all-products-button";
import {getLatestProducts, getFeaturedProducts} from "@/lib/actions/product.actions";
const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title='Newest Arrivals' />
      <ViewAllProductsButton />
      <IconBoxes />
      <DealCountdown />
    </>
  );
};

export default Homepage;
