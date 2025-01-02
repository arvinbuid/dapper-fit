"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {signUpUser} from "@/lib/actions/user.actions";
import {signUpDefaultValue} from "@/lib/constants";
import Link from "next/link";
import {useActionState} from "react";
import {useFormStatus} from "react-dom";
import {useSearchParams} from "next/navigation";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const {pending} = useFormStatus();

    return (
      <Button disabled={pending} className='w-full mt-2' variant='default'>
        {pending ? "Creating account..." : "Sign Up"}
      </Button>
    );
  };
  return (
    <form action={action}>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='space-y-4'>
        <div>
          <Label htmlFor='email'>Name</Label>
          <Input
            type='name'
            id='name'
            name='name'
            autoComplete='name'
            required
            defaultValue={signUpDefaultValue.name}
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            type='email'
            id='email'
            name='email'
            autoComplete='email'
            required
            defaultValue={signUpDefaultValue.email}
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            type='password'
            id='password'
            name='password'
            autoComplete='password'
            required
            defaultValue={signUpDefaultValue.password}
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            autoComplete='confirmPassword'
            required
            defaultValue={signUpDefaultValue.confirmPassword}
            className='mt-1'
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        {data && !data.success && <p className='text-center text-destructive'>{data.message}</p>}
        <div>
          <p className='text-sm text-center text-muted-foreground'>
            Already have an account?{" "}
            <Link href='/sign-in' target='_self' className='link'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
