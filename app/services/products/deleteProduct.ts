import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";

type GetProductI = {
  slug: string;
}

export default async function DeleteProduct({ slug }: GetProductI) {
  const product = await db
    .delete(products)
    .where(eq(products.slug, slug))
    .limit(1)
    .then(res => res[0]);

  if (!product) return null;

  return
}
