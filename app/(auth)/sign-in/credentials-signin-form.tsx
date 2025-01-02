import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {signInDefaultValue} from "@/lib/constants";
import Link from "next/link";

const CredentialsSignInForm = () => {
  return (
    <form>
      <div className='space-y-4'>
        <div>
          <Label htmlFor='email'> Email</Label>
          <Input
            type='email'
            id='email'
            name='email'
            autoComplete='email'
            required
            defaultValue={signInDefaultValue.email}
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='password'> Password</Label>
          <Input
            type='password'
            id='password'
            name='password'
            autoComplete='password'
            required
            defaultValue={signInDefaultValue.password}
            className='mt-1'
          />
        </div>
        <div>
          <Button className='w-full mt-2' variant='default'>
            Sign In
          </Button>
        </div>
        <div>
          <p className='text-sm text-center text-muted-foreground'>
            Don&apos;t have an account?{" "}
            <Link href='/sign-up' target='_self' className='link'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
