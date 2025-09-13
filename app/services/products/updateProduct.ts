import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";

type GetProductI = {
  slug: string;
  data: Partial<{
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  }>;
}

export default async function UpdateProduct({ slug, data }: GetProductI) {
  const updateData = {
    ...data,
    price: data.price !== undefined ? String(data.price) : undefined,
  };

  const product = await db
    .update(products)
    .set(updateData)
    .where(eq(products.slug, slug))

  return product
}
