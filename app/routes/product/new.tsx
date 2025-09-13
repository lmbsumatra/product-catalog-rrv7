import AddProductForm from "~/components/AddProductForm";
import type { Route } from "./+types/new";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New Product | RRv7" }];
}

export default function New() {
  return (
    <div className="bg-base-100 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold">Create Product</h1>
      <p className="text-base-content/70">Add a new product to your store</p>
      <AddProductForm />
    </div>
  );
}
