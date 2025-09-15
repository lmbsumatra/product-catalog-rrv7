import { db } from "~/db/config";
import { users } from "~/db/models/User";

export default async function GetAll() {
    const items = await db.select().from(users);
    if (!items) {
        return;
    }
    return items;
}