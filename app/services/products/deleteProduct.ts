import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";
import { unlink } from "fs/promises";
import { join } from "path";

type GetProductI = {
  slug: string;
}

export default async function DeleteProduct({ slug }: GetProductI) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)
    .then(res => res[0]);

  if (!product) return null;

  if (product.imageUrl) {
    try {
      const imagePath = join(process.cwd(), "public", product.imageUrl.replace(/^\/+/, ""));
      await unlink(imagePath);
    } catch (error) {

    }
  }

  await db
    .delete(products)
    .where(eq(products.slug, slug))
    .limit(1);

  return true;
}
