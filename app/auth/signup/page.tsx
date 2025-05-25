"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth";
import { AxiosError } from "axios";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Confirm your password" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type SignUpSchema = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (loading) return;
      setLoading(true);
      toast({
        title: "Creating account",
        description: "Please wait while we create your account.",
      });

      // Simulate sign up logic or replace with actual registration API
      console.log(values);
      await signUp(values, router);

      // Example success message
      toast({
        title: "Account Created",
        description: "Your account has been successfully created.",
      });

      router.push("/auth/signin");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Something went wrong",
          description: error.response?.data?.toString(),
        });
      } else if (error instanceof Error) {
        toast({
          title: "Something went wrong",
          description: "Please try again later",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground mt-2">
            Create your account to get started.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)} // Use handleSubmit here
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => signIn("google")}>
            Google
          </Button>
          <Button variant="outline" onClick={() => signIn("github")}>
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
