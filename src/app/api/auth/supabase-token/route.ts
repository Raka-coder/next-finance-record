import { auth } from "@/lib/auth";
import { createAdminClient } from "@/utils/supabase/admin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Ensure user exists in Supabase auth with the exact same id
    try {
      await admin.auth.admin.createUser({
        id: session.user.id,
        email: session.user.email,
        email_confirm: true,
        user_metadata: {
          full_name: session.user.name,
          avatar_url: session.user.image,
        },
      });
    } catch {
      // User likely already created
    }

    const linkRes = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: session.user.email,
    });

    if (linkRes.error || !linkRes.data?.properties?.hashed_token) {
      return NextResponse.json(
        { error: linkRes.error?.message || "Gagal membuat token Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token_hash: linkRes.data.properties.hashed_token,
      user_id: session.user.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
