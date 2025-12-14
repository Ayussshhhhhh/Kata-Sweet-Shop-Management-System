import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// POST /api/sweets/:id/restock - Restock a sweet (Admin only)
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userId = session.user.id;
    const adminCheck = await sql(
      "SELECT is_admin FROM user_roles WHERE user_id = $1",
      [userId],
    );

    if (adminCheck.length === 0 || !adminCheck[0].is_admin) {
      return Response.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    const { id } = params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity <= 0) {
      return Response.json(
        { error: "Quantity must be a positive number" },
        { status: 400 },
      );
    }

    const result = await sql(
      `UPDATE sweets 
       SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [parseInt(quantity), parseInt(id)],
    );

    if (result.length === 0) {
      return Response.json({ error: "Sweet not found" }, { status: 404 });
    }

    return Response.json({
      message: "Restock successful",
      sweet: result[0],
    });
  } catch (error) {
    console.error("POST /api/sweets/:id/restock error:", error);
    return Response.json({ error: "Failed to restock sweet" }, { status: 500 });
  }
}
