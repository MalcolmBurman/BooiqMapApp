import { createAuthClient } from "better-auth/react";

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  forgetPassword,
  resetPassword,
} = createAuthClient({
  baseURL: "https://booiqmapappapi.onrender.com",
  fetchOptions: {
    credentials: "include",
    mode: "cors",
  },
});
