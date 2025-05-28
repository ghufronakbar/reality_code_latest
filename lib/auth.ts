import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/config/db";
import bcrypt from "bcryptjs";
import {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} from "@/constants/auth";
import { redirect } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@prisma/client";
import type { GoogleProfile } from "next-auth/providers/google";
import { SignUpSchema } from "@/app/auth/signup/page";
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      async profile(profile: GoogleProfile) {
        const userFromDb = await db.user.findUnique({
          where: { email: profile.email },
        });
        return {
          id: userFromDb?.id?.toString() || profile.sub,
          name: userFromDb?.name || profile.name,
          email: userFromDb?.email || profile.email,
          image: userFromDb?.profilePictureUrl || profile.picture,
          role: userFromDb?.role || "User",
        };
      },
    }),

    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      async profile(profile) {
        console.log("profile", profile);
        const userFromDb = await db.user.findUnique({
          where: { email: profile.email },
        });
        return {
          id: userFromDb?.id?.toString() || profile?.id,
          name: userFromDb?.name || profile?.name || profile?.login,
          role: userFromDb?.role || "User",
          email: profile?.email,
          image: userFromDb?.profilePictureUrl || profile?.avatar_url,
        };
      },
    }),

    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (!email || !password) return null;

        const user = await db.user.findUnique({
          where: { email: email },
        });

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user?.password || "");
        if (user && isMatch) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  // debug: true,
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl + "/";
    },

    async signIn({ user, account }) {
      if (!user || !account) return false;
      if (!user.email) return false;

      console.log("user", user);

      const userExists = await db.user.findUnique({
        where: { email: user?.email },
      });

      if (!userExists) {
        const { provider } = account;
        await db.user.create({
          data: {
            email: user.email,
            name: user.name || `User ${user.email}`,
            provider: provider,
            role: "User",
          },
        });
      }
      return true;
    },

    async session({ session }) {
      if (session && session.user && session.user.email) {
        const userFromDb = await db.user.findUnique({
          where: { email: session?.user?.email },
          select: {
            email: true,
            role: true,
            profilePictureUrl: true,
            bio: true,
            name: true,
          },
        });
        if (userFromDb) {
          session.user.role = userFromDb.role;
          session.user.profilePictureUrl = userFromDb.profilePictureUrl;
          session.user.bio = userFromDb.bio;
          session.user.name = userFromDb.name;
        }
      }
      return session;
    },
  },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

export const serverSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  return session;
};

export const serverSessionWithNoRedirect = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export const signUp = async (dto: SignUpSchema, router: AppRouterInstance) => {
  try {
    await axios.post("/api/signup", { data: dto });
    router.push("/auth/signup");
  } catch (error) {
    throw error;
  }
};

export const getUser = async () => {
  const { data } = await axios.get<User | null>("/api/user");
  return data;
};
