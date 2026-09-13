import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || (
    process.env.NODE_ENV === "production"
      ? { allowedHosts: ["*.vercel.app"] }
      : "http://localhost:3000"
  ),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      accessType: "offline",
      prompt: "select_account",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const { createAdminClient } = await import("@/utils/supabase/admin");
            const admin = createAdminClient();
            await admin.auth.admin.createUser({
              id: user.id,
              email: user.email,
              email_confirm: true,
              user_metadata: {
                full_name: user.name,
                avatar_url: user.image,
              },
            });
          } catch (e) {
            // User might already exist in Supabase auth
            console.log("Supabase user sync notice:", e instanceof Error ? e.message : e);
          }
        },
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    generateId: () => crypto.randomUUID(),
  },
});

export type Auth = typeof auth;
