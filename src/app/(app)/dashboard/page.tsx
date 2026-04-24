'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw, Copy, LayoutDashboard, MessageSquareQuote } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id.toString() !== messageId));
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    }
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Feed Updated", { description: "Showing latest messages" })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to update settings")
    }
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FDF6E3] text-[#5C4033]">
        <Loader2 className="animate-spin mr-2" /> Loading Dashboard...
      </div>
    )
  }

  const { username } = session.user as User
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Link Copied!", {
      description: "You can now share your profile link with others.",
    })
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex p-3 bg-white/60 backdrop-blur-xl border border-[#E3DCC8] rounded-2xl mb-2 shadow-sm">
              <LayoutDashboard className="w-6 h-6 text-[#A0522D]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#5C4033]">User Dashboard</h1>
            <p className="text-[#8B7355] font-medium">Manage your profile and messages</p>
          </div>
          
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="border-[#D2B48C] text-[#A0522D] hover:bg-[#F5DEB3] rounded-full h-12 px-6 font-bold flex gap-2 transition-all shadow-sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh Feed
          </Button>
        </div>

        {/* Copy Link Section - Acrylic Style */}
        <div className="w-full p-8 mb-8 bg-white/60 backdrop-blur-xl border border-[#E3DCC8] rounded-3xl shadow-[0_12px_40px_rgb(210,180,140,0.15)]">
          <h2 className="text-xl font-bold mb-4 text-[#5C4033]">Your Anonymous Link</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full h-10 px-5 bg-[#FAF0E6]/80 border border-[#D2B48C] text-[#5C4033] rounded-2xl font-medium focus:outline-none"
            />
            <Button 
              onClick={copyToClipboard}
              className="w-full md:w-auto bg-[#A0522D] hover:bg-[#8B4513] text-white rounded-full px-5 h-10 flex gap-2 transition-all shadow-md font-bold text-lg"
            >
              <Copy className="w-5 h-5" /> Copy
            </Button>
          </div>
        </div>

        {/* Messaging Toggle Section */}
        <div className="flex items-center gap-4 mb-10 p-6 bg-[#FAF0E6]/60 border border-[#E3DCC8] rounded-2xl shadow-sm">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="data-[state=checked]:bg-[#A0522D] data-[state=unchecked]:bg-[#D2B48C]"
          />
          <span className="font-semibold text-[#5C4033] text-lg">
            Accepting Messages: <span className={acceptMessages ? 'text-green-600' : 'text-[#A0522D]'}>
              {acceptMessages ? 'On' : 'Off'}
            </span>
          </span>
        </div>

        <Separator className="bg-[#E3DCC8] mb-12 opacity-60" />

        {/* Messages Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center">
              <div className="bg-[#FAF0E6] p-8 rounded-full border border-[#E3DCC8] mb-6">
                <MessageSquareQuote className="w-12 h-12 text-[#D2B48C]" />
              </div>
              <p className="text-[#8B7355] text-xl font-bold italic">The inbox is quiet...</p>
              <p className="text-[#A0886F] text-center mt-2 max-w-xs">
                Once people start sending you messages, they'll appear here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage