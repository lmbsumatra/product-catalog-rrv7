import ProductDetails from "~/components/ProductDetails";
import type { Route } from "./+types/slug";
import GetProductBySlug from "~/services/products/getProductBySlug";
import { redirect, type ActionFunctionArgs } from "react-router";
import DeleteProduct from "~/services/products/deleteProduct";
import { getUser } from "~/utils/auth.server";

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

export async function loader({ request, params }: Route.LoaderArgs) {
  const rawUser = await getUser(request);

  const { slug } = params;
  if (!slug) return;

  const data = await GetProductBySlug({ slug });
  if (!data) return;

  return {
    item: data,
    user: rawUser ? { id: Number(rawUser.userId), username: rawUser.username, auth: rawUser.auth } : undefined, 
  };
}


export default function Product({ loaderData, params }: Route.ComponentProps) {
  const item = loaderData ? loaderData.item : undefined;
  const user = loaderData ? loaderData.user : undefined;
  const { slug } = params;

  if (!item || !slug) return <p>Product not found</p>;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto">
        <div className="lg:col-span-2">
          <ProductDetails key={item.id} product={item} user={user} /> 
        </div>
      </div>
    </div>
  );
}

