import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";
import type { Product } from "~/db/schemas";
import generateSlug from "../../utils/generateSlug"

type CreateProductI = {
  data: Omit<Product, "id" | "createdAt" | "updatedAt" | "slug" | "ownerId"> & {
    slug?: string;
    ownerId?: number | null;
  };
};

export default async function AddProduct({ data }: CreateProductI) {

  const slug = generateSlug(data.name)
  const item = await db.insert(products).values({
    ...data,
    ownerId: data.ownerId ?? 1,
    slug,
  });

  return slug;
}
