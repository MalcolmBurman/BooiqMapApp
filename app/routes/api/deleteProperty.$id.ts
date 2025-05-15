import db from "../../server/db.js";
import { addresses } from "../../../auth-schema.js";
import { properties } from "../../../auth-schema.js";
import { eq } from "drizzle-orm";

export async function action({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) {
  if (request.method !== "DELETE") {
    return JSON.stringify({ status: 405, message: "Invalid method" });
  }

  try {
    const { id } = params;

    await db.delete(addresses).where(eq(addresses.property_id, id));

    const result = await db
      .delete(properties)
      .where(eq(properties.id, id))
      .returning({ id: properties.id });

    return JSON.stringify({ status: "success", id: result[0]?.id });
  } catch (error: any) {
    console.error("Drizzle error:", error);
    return JSON.stringify({ status: 500, message: error.message });
  }
}
