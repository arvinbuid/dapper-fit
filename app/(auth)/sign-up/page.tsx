import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {APP_NAME} from "@/lib/constants";
import {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import SignUpForm from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const session = await auth();
  const {callbackUrl} = await props.searchParams;

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} logo`}
              width={100}
              height={100}
              priority={true}
            />
          </Link>

          <CardTitle className='text-center'>Sign Up</CardTitle>
          <CardDescription className='text-center'>Create an account to start.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
