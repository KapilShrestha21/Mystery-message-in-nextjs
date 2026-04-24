// it is a nextauth code for user login

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        await dbConnect()

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        })

        if (!user) {
          throw new Error("No user found")
        }

        if (!user.isVerified) {
          throw new Error("Verify your account first")
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password")
        }

        return {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string
        session.user.isVerified = token.isVerified as boolean
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
        session.user.username = token.username as string
      }
      return session
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
})