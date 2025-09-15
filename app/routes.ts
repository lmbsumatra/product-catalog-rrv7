import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    // products
    route("products", "routes/product/layout.tsx", [
        route("new", "routes/product/new.tsx"),
        route(":slug", "routes/product/slug.tsx"),
        route(":slug/edit", "routes/product/edit.tsx"),
        route("all", "routes/product/index.tsx")
    ]),
    // auth
    route("register", "routes/auth/register.tsx"),
    route("login", "routes/auth/login.tsx"),
    route("logout", "routes/auth/logout.tsx"),
    // users
    route("users", "routes/users/users.tsx")

] satisfies RouteConfig;
