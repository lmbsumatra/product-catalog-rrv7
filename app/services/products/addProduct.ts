import { db } from "~/db/config";
import { products } from "~/db/models/Product";
import type { Product } from "~/db/schemas";
import generateSlug from "../../utils/generateSlug"
import GetProductById from "./getProductById";

type CreateProductI = {
  data: Omit<Product, "id" | "createdAt" | "updatedAt" | "slug"> & {
    slug?: string;
    ownerId?: number | null;
  };
};

export default async function AddProduct({ data }: CreateProductI) {
  const slug = generateSlug(data.name)
  const [{ id }] = await db
    .insert(products)
    .values({
      ...data,
      ownerId: data.ownerId ?? 1,
      slug,
    })
    .$returningId();

  const result = await GetProductById({ id })

  return result ? result.slug : null;

}
