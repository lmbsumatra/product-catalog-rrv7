import ProductDetails from "~/components/ProductDetails";
import type { Route } from "./+types/slug";
import GetProduct from "~/services/products/getProduct";
import { redirect, type ActionFunctionArgs } from "react-router";
import DeleteProduct from "~/services/products/deleteProduct";

export async function action({ request, params }: ActionFunctionArgs) {
  
  const { slug } = params;
  if (!slug) {
    return;
  }
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const data = await DeleteProduct({ slug });
    return redirect("/");
  } 

  return {};
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) {
    console.log("Item not found");
  }

  const data = await GetProduct({ slug });
  if (!data) {
    console.log("Item not found");
    return;
  }
  return { item: data };
}

export default function Product({ loaderData, params }: Route.ComponentProps) {
  const item = loaderData ? loaderData.item : undefined;
  const { slug } = params;

  if (!item || !slug) return <p>Product not found</p>;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto">
        <div className="lg:col-span-2">
          <ProductDetails key={item.id} product={item} />
        </div>
      </div>
    </div>
  );
}
