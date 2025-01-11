import AdminProductForm from "@/components/admin/product-form";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Create New Product",
};

const CreateProductPage = () => {
  return (
    <div className='space-y-2'>
      <h1 className='h2-bold mb-2'>Create Product</h1>
      <AdminProductForm type='Create' />
    </div>
  );
};

export default CreateProductPage;
