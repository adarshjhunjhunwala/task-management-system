import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getUserId() {
    const session = await getServerSession(authOptions);
    
    return session?.user?.id || null;
}