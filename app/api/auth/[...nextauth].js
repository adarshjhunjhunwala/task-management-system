import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/app/lib/mongodb";
import User from "../../models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            await dbConnect();
            const user = await User.findOne({ email: session.user.email });
            session.user.id = user._id;
            return session;
        },
        async signIn({ user, account, profile, email }) {
            await dbConnect();
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                const newUser = new User({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                });
                await newUser.save();
            }
            return true;
        },
    }
};

export default NextAuth(authOptions)