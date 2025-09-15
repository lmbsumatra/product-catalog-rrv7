import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";

type GetProductI = {
  id: number;
}

export default async function GetProductById({ id }: GetProductI) {
  const item = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
    .then(res => res[0]);

  if (!item) return null;

  return item;
}
