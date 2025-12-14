import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// GET /api/sweets/:id - Get a single sweet
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await sql("SELECT * FROM sweets WHERE id = $1", [
      parseInt(id),
    ]);

    if (result.length === 0) {
      return Response.json({ error: "Sweet not found" }, { status: 404 });
    }

    return Response.json({ sweet: result[0] });
  } catch (error) {
    console.error("GET /api/sweets/:id error:", error);
    return Response.json({ error: "Failed to fetch sweet" }, { status: 500 });
  }
}

// PUT /api/sweets/:id - Update a sweet (Protected)
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, category, price, quantity, description, image_url } = body;

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      setClauses.push(`name = $${paramCount}`);
      values.push(name);
    }

    if (category !== undefined) {
      paramCount++;
      setClauses.push(`category = $${paramCount}`);
      values.push(category);
    }

    if (price !== undefined) {
      if (price < 0) {
        return Response.json(
          { error: "Price must be non-negative" },
          { status: 400 },
        );
      }
      paramCount++;
      setClauses.push(`price = $${paramCount}`);
      values.push(parseFloat(price));
    }

    if (quantity !== undefined) {
      if (quantity < 0) {
        return Response.json(
          { error: "Quantity must be non-negative" },
          { status: 400 },
        );
      }
      paramCount++;
      setClauses.push(`quantity = $${paramCount}`);
      values.push(parseInt(quantity));
    }

    if (description !== undefined) {
      paramCount++;
      setClauses.push(`description = $${paramCount}`);
      values.push(description);
    }

    if (image_url !== undefined) {
      paramCount++;
      setClauses.push(`image_url = $${paramCount}`);
      values.push(image_url);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `UPDATE sweets SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    values.push(parseInt(id));

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Sweet not found" }, { status: 404 });
    }

    return Response.json({ sweet: result[0] });
  } catch (error) {
    console.error("PUT /api/sweets/:id error:", error);
    return Response.json({ error: "Failed to update sweet" }, { status: 500 });
  }
}

// DELETE /api/sweets/:id - Delete a sweet (Admin only)
export async function DELETE(request, { params }) {
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
    const result = await sql("DELETE FROM sweets WHERE id = $1 RETURNING *", [
      parseInt(id),
    ]);

    if (result.length === 0) {
      return Response.json({ error: "Sweet not found" }, { status: 404 });
    }

    return Response.json({
      message: "Sweet deleted successfully",
      sweet: result[0],
    });
  } catch (error) {
    console.error("DELETE /api/sweets/:id error:", error);
    return Response.json({ error: "Failed to delete sweet" }, { status: 500 });
  }
}
