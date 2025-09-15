import { useState, useMemo } from "react";
import GetAll from "~/services/products/getAll";
import type { Route } from "./+types/index.ts";
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

export default function Index({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "price":
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case "category":
          aValue = a.category?.toLowerCase() || "";
          bValue = b.category?.toLowerCase() || "";
          break;
        default:
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [items, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <select
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>

            <button
              className="btn btn-square btn-outline"
              onClick={toggleSortOrder}
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
              )}
            </button>
          </div>

          {(searchTerm || sortBy !== "name" || sortOrder !== "asc") && (
            <button
              className="btn btn-ghost btn-square"
              onClick={() => {
                setSearchTerm("");
                setSortBy("name");
                setSortOrder("asc");
              }}
              title="Reset filters"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
        </div>

        {searchTerm && (
          <div className="mb-4">
            <p className="text-base-content/70">
              Found {filteredAndSortedItems.length} product
              {filteredAndSortedItems.length !== 1 ? "s" : ""}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.map((item) => (
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
