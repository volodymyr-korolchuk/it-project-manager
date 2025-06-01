"use client";

import { z } from "zod";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className="w-full h-full md:w-[487px] border border-border/30 bg-card/90 backdrop-blur-xl shadow-xl">
      <CardHeader className="text-center p-6 pb-4">
        <CardTitle className="text-2xl font-medium">
          Welcome back
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-6 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                      className="h-11 border-border/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      className="h-11 border-border/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size="lg" className="w-full h-11 mt-6">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardContent className="px-6 py-4 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => signUpWithGoogle()}
            disabled={isPending}
            variant="outline"
            size="lg"
            className="w-full h-11"
          >
            <FcGoogle className="size-5" />
          </Button>
          <Button
            onClick={() => signUpWithGithub()}
            disabled={isPending}
            variant="outline"
            size="lg"
            className="w-full h-11"
          >
            <FaGithub className="size-5" />
          </Button>
        </div>
      </CardContent>

      <CardContent className="px-6 pt-2 pb-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?
          <Link href="/sign-up">
            <span className="text-primary hover:underline ml-1">Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
