import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// GET /api/sweets - List all sweets with optional search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query = "SELECT * FROM sweets WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND LOWER(category) = LOWER($${paramCount})`;
      values.push(category);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      values.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      values.push(parseFloat(maxPrice));
    }

    query += " ORDER BY created_at DESC";

    const sweets = await sql(query, values);
    return Response.json({ sweets });
  } catch (error) {
    console.error("GET /api/sweets error:", error);
    return Response.json({ error: "Failed to fetch sweets" }, { status: 500 });
  }
}

// POST /api/sweets - Add a new sweet (Protected)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, price, quantity, description, image_url } = body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return Response.json(
        { error: "Missing required fields: name, category, price, quantity" },
        { status: 400 },
      );
    }

    if (price < 0 || quantity < 0) {
      return Response.json(
        { error: "Price and quantity must be non-negative" },
        { status: 400 },
      );
    }

    const result = await sql(
      `INSERT INTO sweets (name, category, price, quantity, description, image_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        name,
        category,
        parseFloat(price),
        parseInt(quantity),
        description || null,
        image_url || null,
      ],
    );

    return Response.json({ sweet: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/sweets error:", error);
    return Response.json({ error: "Failed to create sweet" }, { status: 500 });
  }
}
