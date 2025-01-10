import {auth} from "@/auth";
import {signOutUser} from "@/lib/actions/user.actions";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {UserIcon} from "lucide-react";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const nameFirstLetter = session.user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className='flex-gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            <Button
              className='relative w-8 h-8 ml-2 rounded-full flex items-center justify-center text-slate-900 bg-gray-200'
              variant='ghost'
            >
              {nameFirstLetter}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex-flex-col space-y-1'>
              <div className='text-sm font-medium leading-none'>{session.user?.name}</div>
              <div className='text-sm text-muted-foreground leading-none'>
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href='/user/profile' className='w-full'>
              User Profile
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === "admin" ? (
            <DropdownMenuItem>
              <Link href='/admin/orders' className='w-full'>
                Order History
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link href='/user/orders' className='w-full'>
                Order History
              </Link>
            </DropdownMenuItem>
          )}

          {session?.user?.role === "admin" && (
            <DropdownMenuItem>
              <Link href='/admin/overview' className='w-full'>
                Dashboard
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className='p-0 mb-1'>
            <form action={signOutUser} className='w-full'>
              <Button className='w-full justify-start py-4 px-2 text-sm' variant='ghost'>
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
