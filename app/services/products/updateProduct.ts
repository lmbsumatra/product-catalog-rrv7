import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";
import type { Product } from "~/db/schemas";

type UpdateProductI = {
  slug: string;
  data: Partial<Product>;
}

export default async function UpdateProduct({ slug, data }: UpdateProductI) {
  const item = await db
    .update(products)
    .set(data)
    .where(eq(products.slug, slug))

  return item;
}
