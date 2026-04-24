'use client'

import { useCompletion } from '@ai-sdk/react';
import React from 'react';
import { useParams } from "next/navigation"
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from "@/types/ApiResponse";
import { z } from 'zod';
import { messageSchema } from '@/schemas/messageSchema'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, Sparkles, UserCircle } from "lucide-react";

const PublicProfilePage = () => {
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    }
  })

  const { reset, watch } = form;
  const messageContent = watch('content');

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post('/api/send-message', {
        username: params.username,
        content: data.content
      })
      toast.success(response.data.message);
      reset({ content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to send message");
    }
  }

  const { complete, completion, isLoading, error } = useCompletion({
    api: '/api/suggest-messages',
  });

  const handleSuggestClick = () => {
    complete("");
  };

  const parseMessages = (messageString: string) => {
    return messageString.split('||').filter(msg => msg.trim() !== '');
  };

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-12 px-4">
      <div className="container mx-auto max-w-3xl space-y-8">
        
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-white/60 backdrop-blur-xl border border-[#E3DCC8] rounded-full shadow-sm">
            <UserCircle className="w-12 h-12 text-[#A0522D]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#5C4033]">
            @{params.username}
          </h1>
          <p className="text-[#8B7355] font-medium">Send an anonymous message into the void.</p>
        </div>

        {/* Message Input Card */}
        <div className="bg-white/60 backdrop-blur-xl border border-[#E3DCC8] p-8 rounded-3xl shadow-[0_12px_40px_rgb(210,180,140,0.15)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#8B7355] font-semibold">Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What's on your mind? Don't worry, it's anonymous..."
                        className="resize-none min-h-[150px] bg-white/80 border-[#D2B48C] text-[#5C4033] placeholder:text-[#A0886F] focus:border-[#CD853F] focus:ring-[#CD853F] rounded-2xl p-4 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting || !messageContent}
                  className="w-full md:w-auto bg-[#A0522D] hover:bg-[#8B4513] text-white rounded-full px-6 py-3 h-auto text-xl font-bold transition-all shadow-lg flex gap-3"
                >
                  {form.formState.isSubmitting ? (
                    <><Loader2 className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Send It</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* AI Suggestions Area */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleSuggestClick}
              disabled={isLoading}
              variant="outline"
              className="border-[#D2B48C] text-[#A0522D] hover:bg-[#F5DEB3] rounded-full px-6 py-5 h-auto font-bold flex gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5 text-[#CD853F]" />}
              Suggest Messages
            </Button>
            <p className="text-[#8B7355] text-sm font-medium italic">Need some inspiration? Click a suggestion below.</p>
          </div>

          <Separator className="bg-[#E3DCC8] opacity-60" />

          <div className="grid gap-4">
            {parseMessages(completion).length > 0 ? (
              parseMessages(completion).map((message, index) => (
                <button
                  key={index}
                  onClick={() => handleMessageClick(message)}
                  className="text-left p-4 bg-white/40 hover:bg-[#FAF0E6] border border-[#E3DCC8] rounded-2xl text-[#5C4033] transition-all duration-200 hover:shadow-md hover:border-[#D2B48C] active:scale-[0.98]"
                >
                  {message}
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#A0886F] text-sm">
                  {isLoading ? "The AI is crafting some ideas..." : "No suggestions yet. Let the AI help you out!"}
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage