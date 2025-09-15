import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { products } from "~/db/models/Product";
import type { Product } from "~/db/schemas";
import { unlink } from "fs/promises";
import { join } from "path";

type UpdateProductI = {
  slug: string;
  data: Partial<Product>;
  deleteOldImage?: boolean;
}

export default async function UpdateProduct({ slug, data, deleteOldImage }: UpdateProductI) {
  if (deleteOldImage && data.imageUrl) {
    try {
      const currentProduct = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1)
        .then(res => res[0]);

      if (currentProduct?.imageUrl) {
        const urlParts = currentProduct.imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const imagePath = join(process.cwd(), "public", "assets", filename);

        await unlink(imagePath);
      }
    } catch (error) {
      console.log("Could not delete old image:", error);
    }
  }

  const item = await db
    .update(products)
    .set(data)
    .where(eq(products.slug, slug));

  return item;
}