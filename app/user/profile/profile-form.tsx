"use client";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast";
import {updateUserProfile} from "@/lib/actions/user.actions";
import {updateUserProfileSchema} from "@/lib/validators";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const ProfileForm = () => {
  const {data: session, update} = useSession();

  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const {toast} = useToast();

  const onSubmit = async (values: z.infer<typeof updateUserProfileSchema>) => {
    const res = await updateUserProfile(values);

    if (!res.success) {
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }

    // Store new session
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    // Update the user
    await update(newSession);

    return toast({
      variant: "default",
      description: res.message,
    });
  };

  return (
    <Form {...form}>
      <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='email'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    disabled
                    placeholder='Your new email...'
                    className='input-field'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({field}) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input placeholder='Your new name...' className='input-field' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' size='lg' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
