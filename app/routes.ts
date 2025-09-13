import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("products", "routes/product/layout.tsx", [
        route("new", "routes/product/new.tsx"),
        route(":slug", "routes/product/slug.tsx"),
        route(":slug/edit", "routes/product/edit.tsx")
    ])
] satisfies RouteConfig;
