import {Button} from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {getAllCategories} from "@/lib/actions/product.actions";
import {Menu} from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const categories = await getAllCategories();

  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full max-w-xs md:max-w-sm px-2 pt-6 flex items-center'>
        <DrawerHeader>
          <DrawerTitle className='text-xl'>Select a category</DrawerTitle>
        </DrawerHeader>
        <div className='space-y-2 mt-2'>
          {categories.map((item) => (
            <Button
              key={item.category}
              variant='ghost'
              className='w-full justify-center text-sm'
              asChild
            >
              <DrawerClose asChild>
                <Link href={`/search?category=${item.category}`}>
                  {item.category} ({item._count})
                </Link>
              </DrawerClose>
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
