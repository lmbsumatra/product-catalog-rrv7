import { db } from "~/db/config";
import { products } from "~/db/models/Product";
import type { Product } from "~/db/schemas";

export default async function GetAll() {
    const items = await db.select().from(products);
    if (!items) {
        return;
    }
    return items;
}