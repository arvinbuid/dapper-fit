import {Metadata} from "next";
import {getProductById} from "@/lib/actions/product.actions";
import {auth} from "@/auth";
import {notFound} from "next/navigation";
import AdminProductForm from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Update Product",
};

const AdminUpdateProductPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const session = await auth();

  if (session?.user?.role !== "admin") throw new Error("User not authorized!");

  const {id} = await props.params;

  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h1 className='h2-bold'>Update Product</h1>

      <AdminProductForm type='Update' product={product} productId={product.id} />
    </div>
  );
};

export default AdminUpdateProductPage;
