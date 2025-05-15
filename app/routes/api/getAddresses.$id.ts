import db from "../../server/db.js";
import { addresses } from "../../../auth-schema.js";
import { eq } from "drizzle-orm";

export async function loader({ params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return JSON.stringify({ status: 400, message: "Missing property ID" });
    }
    const result = await db
      .select()
      .from(addresses)
      .where(eq(addresses.property_id, id));

    return JSON.stringify({ status: "success", address: result });
  } catch (error: any) {
    console.error("Drizzle error:", error);
    return JSON.stringify({ status: 500, message: error.message });
  }
}
