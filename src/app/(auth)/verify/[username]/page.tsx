'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from "zod"
import { ShieldCheck } from "lucide-react"

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.success("Success", {
                description: response.data.message,
            })
            router.replace('/sign-in')

        } catch (error) {
            console.error('Error in verification', error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? "An error occurred"
            toast.error(errorMessage)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#FDF6E3] px-4">
            <div className="w-full max-w-md p-10 space-y-8 bg-white/60 backdrop-blur-xl border border-[#E3DCC8] rounded-3xl shadow-[0_12px_40px_rgb(210,180,140,0.25)]">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 text-[#5C4033]">
                        Verify Your Identity
                    </h1>
                    <p className="text-[#8B7355]">
                        Enter the secret code sent to your email to unlock your account.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#8B7355] flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter code" 
                                            {...field} 
                                            className="bg-white/80 border-[#D2B48C] text-[#5C4033] placeholder:text-[#A0886F] focus:border-[#CD853F] focus:ring-[#CD853F] rounded-xl h-14 text-center text-xl tracking-[0.5em] font-bold"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full bg-[#A0522D] text-white hover:bg-[#8B4513] font-bold py-7 transition-all duration-300 shadow-[0_6px_20px_rgba(160,82,45,0.3)] rounded-full text-lg"
                        >
                            Verify Account
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-6">
                    <p className="text-xs text-[#A0886F]">
                        Didn't receive a code? Check your spam folder or try again.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerifyAccount