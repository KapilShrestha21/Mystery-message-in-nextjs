import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, {params}: {params: Promise<{messageid: string}> }) {
    const {messageid} =  await params
    const messageId = messageid

    await dbConnect()

    const session = await auth()
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }

   try {
    const updateResult = await UserModel.updateOne(
        {_id: user._id},
        {$pull: {messages: {_id: messageId}}}
    )
    if (updateResult.modifiedCount === 0) {
         return Response.json(
                {
                    success: false,
                    message: "Message not found or already delete"
                },
                { status: 401 }
            )
    }

     return Response.json(
                {
                    success: true,
                    message: "Message Deleted"
                },
                { status: 200 }
            )
   } catch (error) {
    console.log("Error is delete message route", error)
     return Response.json(
                {
                    success: false,
                    message: "Error deleting message"
                },
                { status: 500 }
            )
   }
}