import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(request: Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {

            const userExists = await UserModel.findById(userId)

            // if user is not exist 
            if (!userExists) {
                return Response.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                )
            }

            // if user exist but have 0 message
            return Response.json(
                {
                    success: true,
                    messages: []
                },
                { status: 200 }
            )
        }

        // is use have 1 or more messages
        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("An unexpected error occured: ", error);

        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 500 }
        )
    }
}