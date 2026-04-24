'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Mail, KeyRound } from "lucide-react"

const SignInPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      callbackUrl: '/dashboard',
      identifier: data.identifier,
      password: data.password,
    })

    if (!result) {
      toast.error("Login Failed", {
        description: "Unable to complete sign in. Please try again."
      })
      return;
    }

    if (result.error) {
      toast.error("Login Failed", {
        description: "Incorrect username or password"
      });
      return;
    }

    if (result.ok) {
      router.replace(result.url ?? '/dashboard');
      return;
    }

    toast.error("Login Failed", {
      description: "Unexpected sign-in response."
    });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FDF6E3] px-4">
      <div className="w-full max-w-md p-10 space-y-8 bg-white/60 backdrop-blur-xl border border-[#E3DCC8] rounded-3xl shadow-[0_12px_40px_rgb(210,180,140,0.25)]">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 text-[#5C4033]">
            Welcome Back
          </h1>
          <p className="text-[#8B7355]">Sign in to continue your private dialogue.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/Username Field */}
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8B7355] flex items-center gap-2"><Mail className="w-4 h-4" /> Email/Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your unique identifier" 
                      {...field} 
                      // Cream input with amber focus ring
                      className="bg-white/80 border-[#D2B48C] text-[#5C4033] placeholder:text-[#A0886F] focus:border-[#CD853F] focus:ring-[#CD853F] rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8B7355] flex items-center gap-2"><KeyRound className="w-4 h-4" /> Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-white/80 border-[#D2B48C] text-[#5C4033] placeholder:text-[#A0886F] focus:border-[#CD853F] focus:ring-[#CD853F] rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Rich Terracotta Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#A0522D] text-white hover:bg-[#8B4513] font-bold py-7 transition-all duration-300 shadow-[0_6px_20px_rgba(160,82,45,0.3)] rounded-full text-lg"
            >
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8 pt-6 border-t border-[#E3DCC8]">
          <p className="text-[#8B7355]">
            New to Mystery Message?{' '}
            <Link href="/sign-up" className="text-[#A0522D] hover:text-[#CD853F] font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage