import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// GET /api/user/role - Get current user's role
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const result = await sql(
      "SELECT is_admin FROM user_roles WHERE user_id = $1",
      [userId],
    );

    const isAdmin = result.length > 0 ? result[0].is_admin : false;

    return Response.json({
      userId,
      isAdmin,
      email: session.user.email,
    });
  } catch (error) {
    console.error("GET /api/user/role error:", error);
    return Response.json(
      { error: "Failed to fetch user role" },
      { status: 500 },
    );
  }
}
