import { createAuthClient } from "better-auth/react"
export const { signIn, signUp, useSession, signOut } = createAuthClient({
    baseURL: "http://localhost:5000",
    sessionOptions: {
        refetchInterval: 0,
        refetchOnWindowFocus: true,
        refetchWhenOffline: false,
    }
})