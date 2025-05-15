import db from "../../server/db.js";
import { auth } from "../../server/auth.js";
import { properties } from "../../../auth-schema.js";
import { eq } from "drizzle-orm";

export async function loader({ request }: { request: Request }) {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(request.headers),
    });

    if (!session || !session.user) {
      return JSON.stringify({ status: 401 });
    }

    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.userId, session.user.id));

    return JSON.stringify({ status: "success", properties: result });
  } catch (error: any) {
    console.error("Drizzle error:", error);
    return JSON.stringify({ status: "error", message: error.message });
  }
}
