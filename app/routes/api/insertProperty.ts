import db from "../../server/db.js";
import { properties } from "../../../auth-schema.js";
import { auth } from "../../server/auth.js";

export async function action({ request }: { request: Request }) {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(request.headers),
    });

    if (!session || !session.user) {
      return JSON.stringify({ status: 401 });
    }

    const { mapObject, fastighetsagare, beteckning, area, byggar } =
      await request.json();

    const result = await db
      .insert(properties)
      .values({
        mapObject,
        userId: session.user.id,
        fastighetsagare,
        beteckning,
        area,
        byggar,
      })
      .returning({ id: properties.id });

    return JSON.stringify({ status: "success", id: result[0]?.id });
  } catch (error: any) {
    console.error("Drizzle error:", error);
    return JSON.stringify({ status: 500, message: error.message });
  }
}
