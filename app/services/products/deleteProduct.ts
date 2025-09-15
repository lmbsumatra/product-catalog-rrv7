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
    const urlParts = product.imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    const imagePath = join(process.cwd(), "public", "assets", filename);
    await unlink(imagePath);

  }

  await db
    .delete(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return true;
}