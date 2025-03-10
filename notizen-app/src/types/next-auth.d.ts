import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
