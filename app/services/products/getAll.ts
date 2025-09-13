import { db } from "~/db/config";
import { products } from "~/db/models/Product";
import type { Product } from "~/db/schemas";

export default async function GetAll() {
    const items = await db.select().from(products);
    const transformed = items.map(p => ({
        ...p,
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description ?? undefined,
        imageUrl: p.imageUrl ?? undefined,
        category: p.category ?? undefined,
        ownerId: p.ownerId ?? undefined,
        price: Number(p.price),
        createdAt: p.createdAt?.toString(),
        updatedAt: p.updatedAt?.toString(),
    }));
    return transformed;
}