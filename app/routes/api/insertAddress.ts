import db from "../../server/db.js";
import { addresses } from "../../../auth-schema.js";

export async function action({ request }: { request: Request }) {
  try {
    const { id, property_id, adress, mapObject } = await request.json();

    const result = await db
      .insert(addresses)
      .values({ id, property_id, adress, mapObject })
      .returning({ id: addresses.id });

    return JSON.stringify({ status: "success", id: result[0]?.id });
  } catch (error: any) {
    console.error("Drizzle error:", error);
    return JSON.stringify({ status: 500, message: error.message });
  }
}
