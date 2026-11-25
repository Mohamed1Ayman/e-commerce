import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-freshcart.session-token"
          : "freshcart.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        let response: Response;
        try {
          response = await fetch(
            "https://ecommerce.routemisr.com/api/v1/auth/signin",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );
        } catch {
          throw new Error("Unable to connect to the authentication service.");
        }

        let result: unknown;
        try {
          result = await response.json();
        } catch {
          throw new Error("The authentication service returned an invalid response.");
        }

        if (!response.ok || !isRecord(result) || !isRecord(result.user)) {
          return null;
        }

        const { user, token } = result;
        const id =
          typeof user._id === "string"
            ? user._id
            : typeof user.id === "string"
              ? user.id
              : user.email;

        if (
          typeof token !== "string" ||
          typeof id !== "string" ||
          typeof user.name !== "string" ||
          typeof user.email !== "string"
        ) {
          return null;
        }

        return {
          id,
          name: user.name,
          email: user.email,
          accessToken: token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }

      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
};
