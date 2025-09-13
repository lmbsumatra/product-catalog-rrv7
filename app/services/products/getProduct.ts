import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";

type GetProductI = {
  slug: string;
}

export default async function GetProduct({ slug }: GetProductI) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)
    .then(res => res[0]); 

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? undefined,
    imageUrl: product.imageUrl ?? undefined,
    category: product.category ?? undefined,
    ownerId: product.ownerId ?? undefined,
    price: Number(product.price),
    createdAt: product.createdAt?.toString(),
    updatedAt: product.updatedAt?.toString(),
  };
}
