import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// POST /api/admin/promote - Promote current user to admin (First-time setup only)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // Check if user already has a role
    const existingRole = await sql(
      "SELECT * FROM user_roles WHERE user_id = $1",
      [userId],
    );

    if (existingRole.length > 0) {
      if (existingRole[0].is_admin) {
        return Response.json({ message: "You are already an admin" });
      } else {
        // Update existing role to admin
        await sql("UPDATE user_roles SET is_admin = true WHERE user_id = $1", [
          userId,
        ]);
        return Response.json({ message: "Successfully promoted to admin" });
      }
    } else {
      // Create new admin role
      await sql(
        "INSERT INTO user_roles (user_id, is_admin) VALUES ($1, true)",
        [userId],
      );
      return Response.json({ message: "Successfully promoted to admin" });
    }
  } catch (error) {
    console.error("POST /api/admin/promote error:", error);
    return Response.json({ error: "Failed to promote user" }, { status: 500 });
  }
}
