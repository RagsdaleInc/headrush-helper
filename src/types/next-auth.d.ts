import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "FREE" | "PAID" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "FREE" | "PAID" | "ADMIN";
  }
}
