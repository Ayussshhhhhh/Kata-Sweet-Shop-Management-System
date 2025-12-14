import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// POST /api/sweets/:id/purchase - Purchase a sweet (Protected)
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
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

    const userId = session.user.id;

    // Use transaction to ensure data consistency
    const result = await sql.transaction([
      sql`SELECT * FROM sweets WHERE id = ${parseInt(id)} FOR UPDATE`,
      sql`SELECT 1`,
    ]);

    const sweetResult = result[0];

    if (sweetResult.length === 0) {
      return Response.json({ error: "Sweet not found" }, { status: 404 });
    }

    const sweet = sweetResult[0];

    if (sweet.quantity < quantity) {
      return Response.json(
        { error: `Insufficient stock. Only ${sweet.quantity} available.` },
        { status: 400 },
      );
    }

    const totalPrice = parseFloat(sweet.price) * parseInt(quantity);
    const newQuantity = sweet.quantity - parseInt(quantity);

    // Update sweet quantity and create purchase record
    const updateResult = await sql.transaction([
      sql`UPDATE sweets SET quantity = ${newQuantity}, updated_at = CURRENT_TIMESTAMP WHERE id = ${parseInt(id)} RETURNING *`,
      sql`INSERT INTO purchases (user_id, sweet_id, quantity, total_price) VALUES (${userId}, ${parseInt(id)}, ${parseInt(quantity)}, ${totalPrice}) RETURNING *`,
    ]);

    const updatedSweet = updateResult[0][0];
    const purchase = updateResult[1][0];

    return Response.json({
      message: "Purchase successful",
      sweet: updatedSweet,
      purchase,
    });
  } catch (error) {
    console.error("POST /api/sweets/:id/purchase error:", error);
    return Response.json(
      { error: "Failed to process purchase" },
      { status: 500 },
    );
  }
}
