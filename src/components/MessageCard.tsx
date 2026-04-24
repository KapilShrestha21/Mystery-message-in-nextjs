'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X, Calendar } from 'lucide-react'
import { Message } from "@/model/User"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast.success(response.data.message);
            onMessageDelete(message._id.toString() as string); 
        } catch (error) {
            toast.error("Failed to delete message");
        }
    }

    return (
        <Card className="bg-white/50 backdrop-blur-md border-[#E3DCC8] rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-bold text-[#5C4033]">Anonymous Message</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-[#8B7355] font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(message.createdAt).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                        </CardDescription>
                    </div>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-[#A0886F] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#FDF6E3] border-[#E3DCC8] rounded-3xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#5C4033] text-xl">Delete Message?</AlertDialogTitle>
                                <AlertDialogDescription className="text-[#8B7355]">
                                    This will permanently remove this message from your dashboard. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel className="rounded-full border-[#D2B48C] text-[#8B7355] hover:bg-[#FAF0E6]">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDeleteConfirm}
                                    className="rounded-full bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-white/40 rounded-2xl border border-[#FAF0E6]">
                    <p className="text-[#5C4033] leading-relaxed text-lg italic">
                        "{message.content}"
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default MessageCard