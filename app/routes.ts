import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("properties", "routes/properties.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("home", "routes/home.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
] satisfies RouteConfig;
