import Link from "next/link";
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='border-b container mx-auto'>
          <div className='flex items-center h-16 px-4'>
            <Link href='/' className='hidden md:block w-22'>
              <Image src='/images/logo.svg' width={48} height={48} alt={APP_NAME}></Image>
            </Link>
            <MainNav className='mx-6' />
            {/* Main Nav */}
            <div className='ml-auto flex items-center space-x-4'>
              <AdminSearch />
              <Menu />
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-4 p-8 pt-6 container mx-auto'>{children}</div>
      </div>
    </>
  );
}
