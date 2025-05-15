import db from "../../server/db.js";
import { properties } from "../../../auth-schema.js";
import { eq } from "drizzle-orm";

export async function loader({ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return JSON.stringify({ status: "success", address: result });
  } catch (error) {
    console.error("Drizzle error:", error);
  }
}
