import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";

type GetProductI = {
  slug: string;
}

export default async function GetProduct({ slug }: GetProductI) {
  const item = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)
    .then(res => res[0]);

  if (!item) return null;

  return item;
}
