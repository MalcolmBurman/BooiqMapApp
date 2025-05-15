import db from "../../server/db.js";
import { properties } from "../../../auth-schema.js";
import { eq } from "drizzle-orm";

export async function action({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) {
  try {
    const id = params.id;
    const body = await request.json();
    const { mapObject, fastighetsagare, beteckning, area, byggar } = body;

    const updatedData: Record<string, unknown> = {};
    if (mapObject !== undefined) updatedData.mapObject = mapObject;
    if (fastighetsagare !== undefined)
      updatedData.fastighetsagare = fastighetsagare;
    if (beteckning !== undefined) updatedData.beteckning = beteckning;
    if (area !== undefined) updatedData.area = area;
    if (byggar !== undefined) updatedData.byggar = byggar;

    const result = await db
      .update(properties)
      .set(updatedData)
      .where(eq(properties.id, id))
      .returning({ id: properties.id });

    return JSON.stringify({ status: "success", id: result[0]?.id });
  } catch (error: any) {
    console.error("Drizzle error:", error);
    return JSON.stringify({ status: 500, message: error.message });
  }
}
