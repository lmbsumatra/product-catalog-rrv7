import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { users } from "~/db/models/User";


export async function CheckUserAuth(id: number) {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

    const user = result[0] ?? null;
    return user.auth ?? false;
}