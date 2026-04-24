'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, User, Mail, LockKeyhole } from "lucide-react"

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FDF6E3] px-4 py-12">
      <div className="w-full max-w-md p-10 space-y-8 bg-white/60 backdrop-blur-xl border border-[#E3DCC8] rounded-3xl shadow-[0_12px_40px_rgb(210,180,140,0.25)]">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 text-[#5C4033]">
            Join the Mystery
          </h1>
          <p className="text-[#8B7355]">Create your account to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8B7355] flex items-center gap-2"><User className="w-4 h-4" /> Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Choose a unique username" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                        className="bg-white/80 border-[#D2B48C] text-[#5C4033] placeholder:text-[#A0886F] focus:border-[#CD853F] focus:ring-[#CD853F] rounded-xl h-12"
                      />
                      {isCheckingUsername && (
                        <Loader2 className="absolute right-3 top-3 animate-spin text-[#CD853F] h-5 w-5" />
                      )}
                    </div>
                  </FormControl>
                  {usernameMessage && !isCheckingUsername && (
                    <p className={`text-xs mt-1 font-medium ${usernameMessage === "Username is unique" ? 'text-green-600' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8B7355] flex items-center gap-2"><Mail className="w-4 h-4" /> Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      {...field} 
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
                  <FormLabel className="text-[#8B7355] flex items-center gap-2"><LockKeyhole className="w-4 h-4" /> Password</FormLabel>
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

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#A0522D] text-white hover:bg-[#8B4513] font-bold py-7 transition-all duration-300 shadow-[0_6px_20px_rgba(160,82,45,0.3)] rounded-full text-lg mt-2"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing...</>
              ) : ('Sign Up')}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6 pt-6 border-t border-[#E3DCC8]">
          <p className="text-[#8B7355]">
            Already a member?{' '}
            <Link href="/sign-in" className="text-[#A0522D] hover:text-[#CD853F] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage