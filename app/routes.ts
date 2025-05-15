import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route("/api/auth/*", "routes/api/auth.ts"),
  route("api/getProperties", "routes/api/getProperties.ts"),
  route("api/getAddresses", "routes/api/getAddresses.ts"),
  route("api/getAddresses/:id", "routes/api/getAddresses.$id.ts"),
  route("api/getProperty/:id", "routes/api/getProperty.$id.ts"),
  route("api/updateProperty/:id", "routes/api/updateProperty.$id.ts"),
  route("api/insertProperty", "routes/api/insertProperty.ts"),
  route("api/insertAddress", "routes/api/insertAddress.ts"),
  route("api/deleteProperty/:id", "routes/api/deleteProperty.$id.ts"),
  route("api/deleteAddress/:id", "routes/api/deleteAddress.$id.ts"),

  index("routes/index.tsx"),
  route("properties", "routes/properties.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("home", "routes/home.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
] satisfies RouteConfig;
