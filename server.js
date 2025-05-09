import express from "express";
import db from "./db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import cors from "cors";
import { properties, addresses } from "./schema.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.VITE_FRONT_URL, credentials: true }));
app.options("{*any}", cors());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.get("/getProperties", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return res.status(401).json({ status: "unauthorized", session });
    }

    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.userId, session.user.id));
    res.json({ status: "success", properties: result });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/getAddresses", async (req, res) => {
  try {
    const result = await db.select().from(addresses);
    res.json({ status: "success", addresses: result });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/getAddresses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(addresses)
      .where(eq(addresses.property_id, id));
    res.json({ status: "success", address: result });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/getProperty/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    res.json({ status: "success", property: result[0] });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.put("/updateProperty/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mapObject, fastighetsagare, beteckning, area, byggar } = req.body;

    const updatedData = {};
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
    res.json({ status: "success", id: result[0].id });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/insertProperty", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return res.status(401).json({ status: "unauthorized" });
    }
    const { mapObject, fastighetsagare, beteckning, area, byggar } = req.body;
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
    res.json({ status: "success", id: result[0].id });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/insertAddress", async (req, res) => {
  try {
    const { id, property_id, adress, mapObject } = req.body;
    const result = await db
      .insert(addresses)
      .values({ id, property_id, adress, mapObject })
      .returning({ id: addresses.id });
    res.json({ status: "success", id: result[0].id });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.delete("/deleteProperty/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(addresses).where(eq(addresses.property_id, id));

    const result = await db
      .delete(properties)
      .where(eq(properties.id, id))
      .returning({ id: properties.id });
    res.json({ status: "success", id: result[0].id });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.delete("/deleteAddress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .delete(addresses)
      .where(eq(addresses.id, id))
      .returning({ id: addresses.id });
    res.json({ status: "success", id: result[0].id });
  } catch (error) {
    console.error("Drizzle error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
