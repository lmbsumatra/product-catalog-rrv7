import GetAll from "~/services/products/getAll";
import type { Route } from "./+types/home";
import ProductCard from "~/components/ProductCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | RRv7" },
    { name: "description", content: "Welcome to RRv7 Product Catalog" },
  ];
}

export async function loader() {
  const products = await GetAll();
  return { items: products ?? [] };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Featured Products
          </h2>
          <div className="divider w-24 mx-auto"></div>
          <p className="text-base-content/70 text-lg">
            Explore our curated collection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold mb-2">No Products Yet</h3>
            <p className="text-base-content/70 mb-6">
              Be the first to add a product to our store!
            </p>
            <a href="/products/new" className="btn btn-primary">
              Add Product
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
