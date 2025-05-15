import db from "../../server/db.js";
import { addresses } from "../../../auth-schema.js";

export async function loader() {
  try {
    const result = await db.select().from(addresses);
    return JSON.stringify({ status: "success", addresses: result });
  } catch (error) {
    console.error("Drizzle error:", error);
  }
}
